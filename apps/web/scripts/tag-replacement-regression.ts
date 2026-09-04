/**
 * Focused regression reproduction for the intermittent
 *   duplicate key value violates unique constraint "post_tags_pkey"
 * failure when editing/publishing a post with tags.
 *
 * The real write path is admin-only (RLS: is_admin()), so an automated run
 * cannot exercise it without a live admin session. Instead this reproduces the
 * exact SQL sequences `createPost`/`updatePost` issue (see
 * apps/web/src/lib/admin-posts.ts) against an in-memory store that enforces
 * Postgres composite-primary-key semantics, and compares the OLD algorithm
 * (delete-all + plain insert) with the NEW one (dedupe + diff delete + upsert
 * ON CONFLICT DO NOTHING).
 *
 * Run from the repo root:
 *   node_modules/.bin/tsx apps/web/scripts/tag-replacement-regression.ts
 */

import { validatePostInput } from '../src/lib/post-input';

const DUP_KEY_MSG = 'duplicate key value violates unique constraint "post_tags_pkey"';

interface TagLink {
  post_id: string;
  tag_id: string;
}

/** In-memory post_tags table with Postgres pkey semantics. */
class TagStore {
  rows: TagLink[] = [];

  /** Plain INSERT — throws the exact Postgres duplicate-key message. */
  insert(links: TagLink[]): void {
    for (const link of links) {
      if (
        this.rows.some(
          (r) => r.post_id === link.post_id && r.tag_id === link.tag_id
        )
      ) {
        throw new Error(DUP_KEY_MSG);
      }
      this.rows.push(link);
    }
  }

  /** PostgREST upsert: ON CONFLICT (post_id, tag_id) DO NOTHING. */
  upsert(links: TagLink[], onConflict: string, ignoreDuplicates: boolean): void {
    if (onConflict !== 'post_id,tag_id' || !ignoreDuplicates) {
      throw new Error('test error: unexpected upsert parameters');
    }
    for (const link of links) {
      if (
        !this.rows.some(
          (r) => r.post_id === link.post_id && r.tag_id === link.tag_id
        )
      ) {
        this.rows.push(link);
      }
    }
  }

  /**
   * DELETE ... WHERE post_id = ? [AND tag_id NOT IN (excluded)].
   * `null` excludedTagIds means delete all rows for the post.
   */
  deleteFor(postId: string, excludedTagIds: string[] | null): void {
    this.rows = this.rows.filter(
      (r) =>
        r.post_id !== postId ||
        (excludedTagIds !== null && excludedTagIds.includes(r.tag_id))
    );
  }

  linksFor(postId: string): string[] {
    return this.rows
      .filter((r) => r.post_id === postId)
      .map((r) => r.tag_id)
      .sort();
  }
}

class ApiErrorLike extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** OLD updatePost tag replacement (delete-all + plain insert, no conflict handling). */
async function replaceTagsOld(
  store: TagStore,
  postId: string,
  inputTagIds: string[]
): Promise<void> {
  const oldLinks = store.linksFor(postId); // SELECT tag_id
  store.deleteFor(postId, null); // DELETE all
  if (inputTagIds.length > 0) {
    try {
      store.insert(inputTagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })));
    } catch (err) {
      // Best-effort restore (plain insert — can itself duplicate under a race).
      if (oldLinks.length > 0) {
        try {
          store.insert(oldLinks.map((tagId) => ({ post_id: postId, tag_id: tagId })));
        } catch {
          /* restore failure ignored, same as production */
        }
      }
      throw new ApiErrorLike(500, `Failed to attach tags: ${(err as Error).message}`);
    }
  }
}

/** NEW updatePost tag replacement (dedupe + diff delete + upsert DO NOTHING). */
async function replaceTagsNew(
  store: TagStore,
  postId: string,
  inputTagIds: string[]
): Promise<void> {
  const newTagIds = Array.from(new Set(inputTagIds));
  const oldLinks = store.linksFor(postId); // SELECT tag_id
  // DELETE ... WHERE post_id = ? AND tag_id NOT IN (new set)
  store.deleteFor(postId, newTagIds.length === 0 ? null : newTagIds);
  if (newTagIds.length > 0) {
    try {
      store.upsert(
        newTagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })),
        'post_id,tag_id',
        true
      );
    } catch (err) {
      if (oldLinks.length > 0) {
        try {
          store.upsert(
            oldLinks.map((tagId) => ({ post_id: postId, tag_id: tagId })),
            'post_id,tag_id',
            true
          );
        } catch {
          /* restore failure ignored, same as production */
        }
      }
      throw new ApiErrorLike(500, `Failed to attach tags: ${(err as Error).message}`);
    }
  }
}

/** Runs request phase-arrays in round-robin, awaiting between phases so two
 *  in-flight HTTP requests deterministically interleave at network boundaries. */
async function runInterleaved(
  requests: (() => Promise<void>)[][]
): Promise<void> {
  const iterators = requests.map((steps) => steps[Symbol.iterator]());
  let pending = iterators.length;
  while (pending > 0) {
    pending = 0;
    for (const it of iterators) {
      const next = it.next();
      if (!next.done) {
        await next.value();
        pending += 1;
      }
    }
  }
}

let failures = 0;
let assertions = 0;

function check(cond: boolean, label: string): void {
  assertions += 1;
  if (cond) {
    console.log(`  PASS ${label}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${label}`);
  }
}

function deepEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

const POST = 'post-1';
const A = 'tag-a';
const B = 'tag-b';
const C = 'tag-c';

// ---------------------------------------------------------------------------
// Scenario 5b — the race: two in-flight saves (double-submit) on the same post.
// Both requests read + delete before either re-inserts; the second INSERT then
// trips post_tags_pkey. This is the reported intermittent failure.
// ---------------------------------------------------------------------------
async function scenarioRace(oldAlgo: boolean): Promise<boolean> {
  const store = new TagStore();
  store.insert([
    { post_id: POST, tag_id: A },
    { post_id: POST, tag_id: B },
  ]);
  const errors: string[] = [];

  if (oldAlgo) {
    await runInterleaved([
      [
        async () => {
          store.linksFor(POST);
        },
        async () => {
          store.deleteFor(POST, null);
        },
        async () => {
          try {
            store.insert([{ post_id: POST, tag_id: A }, { post_id: POST, tag_id: B }]);
          } catch (err) {
            errors.push((err as Error).message);
          }
        },
      ],
      [
        async () => {
          store.linksFor(POST);
        },
        async () => {
          store.deleteFor(POST, null);
        },
        async () => {
          try {
            store.insert([{ post_id: POST, tag_id: A }, { post_id: POST, tag_id: B }]);
          } catch (err) {
            errors.push((err as Error).message);
          }
        },
      ],
    ]);
    return errors.length > 0;
  }

  // NEW algorithm — split into read / diff-delete / upsert phases.
  await runInterleaved([
    [
      async () => {
        store.linksFor(POST);
      },
      async () => {
        store.deleteFor(POST, [A, B]);
      },
      async () => {
        store.upsert([{ post_id: POST, tag_id: A }, { post_id: POST, tag_id: B }], 'post_id,tag_id', true);
      },
    ],
    [
      async () => {
        store.linksFor(POST);
      },
      async () => {
        store.deleteFor(POST, [A, B]);
      },
      async () => {
        store.upsert([{ post_id: POST, tag_id: A }, { post_id: POST, tag_id: B }], 'post_id,tag_id', true);
      },
    ],
  ]);
  return store.linksFor(POST).length === 2;
}

async function main(): Promise<void> {
  console.log('tag replacement regression — post_tags duplicate-key reproduction');
  console.log('(in-memory store models the post_tags_pkey constraint and the exact');
  console.log(' SQL sequences issued by createPost/updatePost)\n');

  // S1 — create post with multiple tags (createPost path: dedupe + insert).
  {
    console.log('S1 create post with multiple tags:');
    const store = new TagStore();
    const tagIds = Array.from(new Set([A, B]));
    store.insert(tagIds.map((t) => ({ post_id: POST, tag_id: t })));
    check(deepEqual(store.linksFor(POST), [A, B]), 'both tags attached');
  }

  // S2 — edit without changing tags.
  {
    console.log('S2 edit same post without changing tags:');
    const store = new TagStore();
    store.insert([{ post_id: POST, tag_id: A }, { post_id: POST, tag_id: B }]);
    await replaceTagsNew(store, POST, [A, B]);
    check(deepEqual(store.linksFor(POST), [A, B]), 'tags unchanged, no error');
  }

  // S3 — edit and change tags.
  {
    console.log('S3 edit and change tags:');
    const store = new TagStore();
    store.insert([{ post_id: POST, tag_id: A }, { post_id: POST, tag_id: B }]);
    await replaceTagsNew(store, POST, [B, C]);
    check(deepEqual(store.linksFor(POST), [B, C]), 'set replaced to [B, C]');
  }

  // S4 — publish an existing draft with tags (draft had none).
  {
    console.log('S4 publish an existing draft with tags:');
    const store = new TagStore();
    await replaceTagsNew(store, POST, [A, B]);
    check(deepEqual(store.linksFor(POST), [A, B]), 'draft gained [A, B]');
  }

  // S5a — repeat the same save sequentially (why retries "sometimes succeed").
  {
    console.log('S5a repeat same save sequentially (old + new):');
    let store = new TagStore();
    store.insert([{ post_id: POST, tag_id: A }, { post_id: POST, tag_id: B }]);
    await replaceTagsOld(store, POST, [A, B]);
    await replaceTagsOld(store, POST, [A, B]);
    check(deepEqual(store.linksFor(POST), [A, B]), 'old algorithm: sequential repeats pass');

    store = new TagStore();
    store.insert([{ post_id: POST, tag_id: A }, { post_id: POST, tag_id: B }]);
    await replaceTagsNew(store, POST, [A, B]);
    await replaceTagsNew(store, POST, [A, B]);
    check(deepEqual(store.linksFor(POST), [A, B]), 'new algorithm: sequential repeats pass');
  }

  // S5b — the double-submit race (two in-flight saves).
  {
    console.log('S5b repeat same save concurrently (double-submit race):');
    const oldRaceFailed = await scenarioRace(true);
    check(
      oldRaceFailed,
      'old algorithm reproduces duplicate-key failure (both inserts after both deletes)'
    );
    const newRaceSafe = await scenarioRace(false);
    check(newRaceSafe, 'new algorithm survives the race with both tag sets intact');
  }

  // S6 — duplicate tag IDs in input.
  {
    console.log('S6 duplicate tag IDs in input:');
    const TA = '11111111-1111-4111-8111-111111111111';
    const TB = '22222222-2222-4222-8222-222222222222';
    const validated = validatePostInput({
      title: 'T', description: '', content: 'c', categoryId: 'a6099ea0-29f5-440a-a7f7-9789ebc16965',
      tagIds: [TA, TA, TB], featured: false, trending: false, status: 'draft',
    });
    check(validated.ok === true, 'validation accepts the payload');
    if (validated.ok) {
      check(
        deepEqual(validated.value.tagIds, [TA, TB]),
        'validatePostInput dedupes tagIds'
      );
    }
    const store = new TagStore();
    await replaceTagsNew(store, POST, [A, A, B]);
    check(
      deepEqual(store.linksFor(POST), [A, B]),
      'DB-layer dedupe: [A, A, B] yields exactly one post_tags row per pair'
    );
  }

  console.log(`\n${assertions} assertions, ${failures} failure(s)`);
  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});