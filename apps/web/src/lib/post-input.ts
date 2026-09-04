/**
 * Admin post input contract + validation. Pure TypeScript — safe to import
 * from both the client post form and the server route handlers. All mutation
 * input is validated here, server-side, before touching the database.
 */

export type PostStatus = 'draft' | 'published';

export interface PostInput {
  title: string;
  slug?: string;
  description: string;
  content: string;
  coverImageUrl?: string;
  categoryId: string;
  tagIds: string[];
  featured: boolean;
  trending: boolean;
  seoTitle?: string;
  seoDescription?: string;
  status: PostStatus;
  /** Minutes. Optional — when omitted the server computes it from content. */
  readingTime?: number;
}

export type ValidationResult =
  | { ok: true; value: PostInput }
  | { ok: false; errors: string[] };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TAGS = 20;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export function validatePostInput(body: unknown): ValidationResult {
  const record = asRecord(body);
  if (!record) {
    return { ok: false, errors: ['Request body must be a JSON object.'] };
  }

  const errors: string[] = [];
  const push = (message: string) => errors.push(message);

  const title = typeof record.title === 'string' ? record.title.trim() : '';
  if (title.length === 0) push('Title is required.');
  else if (title.length > 200) push('Title must be 200 characters or fewer.');

  const slugRaw = asOptionalString(record.slug);
  if (slugRaw !== undefined && !SLUG_RE.test(slugRaw)) {
    push('Slug may only contain lowercase letters, numbers and single hyphens.');
  }
  if (slugRaw !== undefined && slugRaw.length > 160) {
    push('Slug must be 160 characters or fewer.');
  }

  const description =
    typeof record.description === 'string' ? record.description.trim() : '';
  if (description.length > 600) {
    push('Description must be 600 characters or fewer.');
  }

  const content = typeof record.content === 'string' ? record.content : '';
  if (typeof record.content !== 'string') {
    push('Content is required.');
  }

  const coverImageUrl = asOptionalString(record.coverImageUrl);
  if (coverImageUrl !== undefined) {
    try {
      const parsed = new URL(coverImageUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        push('Cover image URL must start with http:// or https://.');
      }
    } catch {
      push('Cover image URL is not a valid URL.');
    }
  }

  const categoryId =
    typeof record.categoryId === 'string' ? record.categoryId.trim() : '';
  if (!UUID_RE.test(categoryId)) {
    push('Category is required and must be a valid category.');
  }

  let tagIds: string[] = [];
  if (!Array.isArray(record.tagIds)) {
    push('tagIds must be an array.');
  } else {
    tagIds = Array.from(new Set(record.tagIds.filter((t): t is string => typeof t === 'string')));
    if (tagIds.length > MAX_TAGS) push(`Choose at most ${MAX_TAGS} tags.`);
    for (const id of tagIds) {
      if (!UUID_RE.test(id)) {
        push('Each tag must be a valid tag id.');
        break;
      }
    }
  }

  const featured = record.featured === true;
  const trending = record.trending === true;

  const seoTitle = asOptionalString(record.seoTitle);
  if (seoTitle !== undefined && seoTitle.length > 200) {
    push('SEO title must be 200 characters or fewer.');
  }
  const seoDescription = asOptionalString(record.seoDescription);
  if (seoDescription !== undefined && seoDescription.length > 300) {
    push('SEO description must be 300 characters or fewer.');
  }

  const status = record.status;
  if (status !== 'draft' && status !== 'published') {
    push('Status must be "draft" or "published".');
  }

  let readingTime: number | undefined;
  if (record.readingTime !== undefined && record.readingTime !== null && record.readingTime !== '') {
    const parsed = Number(record.readingTime);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 999) {
      push('Reading time must be a whole number of minutes between 1 and 999.');
    } else {
      readingTime = parsed;
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      title,
      slug: slugRaw,
      description,
      content,
      coverImageUrl,
      categoryId,
      tagIds,
      featured,
      trending,
      seoTitle,
      seoDescription,
      status: status as PostStatus,
      readingTime,
    },
  };
}
