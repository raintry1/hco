import type { SupabaseClient } from '@supabase/supabase-js';
import type { PostInput } from '@/lib/post-input';
import { slugify, calculateReadingTime } from '@/lib/utils';

/**
 * Server-only post management over the caller's authenticated Supabase client
 * (obtained from the cookie session). RLS is the enforcement boundary: every
 * query/write below runs as the signed-in user, so a non-admin is rejected by
 * the database regardless of what this code does. The service-role key is
 * never used.
 */

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Camel-case post shape returned to the admin UI. */
export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImageUrl: string | null;
  authorId: string;
  authorName: string | null;
  categoryId: string;
  categoryName: string | null;
  tagIds: string[];
  publishedAt: string | null;
  updatedAt: string;
  readingTime: number;
  viewCount: number;
  featured: boolean;
  trending: boolean;
  status: 'draft' | 'published';
  seoTitle: string | null;
  seoDescription: string | null;
}

const POST_SELECT = `
  id, slug, title, description, content, cover_image_url, author_id,
  category_id, published_at, updated_at, reading_time, view_count,
  featured, trending, status, seo_title, seo_description,
  category:categories(id, name),
  author:profiles_public(id, display_name),
  tags:post_tags(tag_id)
`;

interface PostRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_image_url: string | null;
  author_id: string;
  category_id: string;
  published_at: string | null;
  updated_at: string;
  reading_time: number;
  view_count: number;
  featured: boolean;
  trending: boolean;
  status: 'draft' | 'published';
  seo_title: string | null;
  seo_description: string | null;
  category: { id: string; name: string } | null;
  author: { id: string; display_name: string } | null;
  tags: { tag_id: string }[] | null;
}

function mapPost(row: unknown): AdminPost {
  const p = row as PostRow;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    content: p.content,
    coverImageUrl: p.cover_image_url,
    authorId: p.author_id,
    authorName: p.author?.display_name ?? null,
    categoryId: p.category_id,
    categoryName: p.category?.name ?? null,
    tagIds: (p.tags ?? []).map((t) => t.tag_id),
    publishedAt: p.published_at,
    updatedAt: p.updated_at,
    readingTime: p.reading_time,
    viewCount: p.view_count,
    featured: p.featured,
    trending: p.trending,
    status: p.status,
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
  };
}

export async function fetchPost(
  supabase: SupabaseClient,
  id: string
): Promise<AdminPost> {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, 'Post not found.');
  return mapPost(data);
}

/** Category/tag options for the post form (public taxonomy, RLS-readable). */
export async function fetchTaxonomy(supabase: SupabaseClient) {
  const [{ data: categories, error: categoryError }, { data: tags, error: tagError }] =
    await Promise.all([
      supabase.from('categories').select('id, name').order('name'),
      supabase.from('tags').select('id, name').order('name'),
    ]);
  if (categoryError || tagError) {
    throw new ApiError(
      500,
      categoryError?.message ?? tagError?.message ?? 'Failed to load taxonomy.'
    );
  }
  return {
    categories: (categories ?? []) as { id: string; name: string }[],
    tags: (tags ?? []) as { id: string; name: string }[],
  };
}

/** All posts (including drafts) newest-first. Admin RLS scope. */
export async function listPosts(supabase: SupabaseClient): Promise<AdminPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .order('updated_at', { ascending: false });

  if (error) throw new ApiError(500, error.message);
  return (data ?? []).map((row) => mapPost(row));
}

/** Resolve a unique slug; appends -2, -3… when the preferred slug is taken. */
async function uniqueSlug(
  supabase: SupabaseClient,
  preferred: string,
  excludeId?: string
): Promise<string> {
  const { data: hit } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', preferred)
    .maybeSingle();
  const exists = (row?: { id: string } | null) =>
    !!row && row.id !== excludeId;

  if (!exists(hit)) return preferred;

  for (let attempt = 2; attempt <= 50; attempt++) {
    const candidate = `${preferred}-${attempt}`;
    const { data: candidateHit } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (!exists(candidateHit)) return candidate;
  }
  throw new ApiError(409, 'Could not generate a unique slug. Try a different title.');
}

async function assertCategoryExists(
  supabase: SupabaseClient,
  categoryId: string
): Promise<void> {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('id', categoryId)
    .maybeSingle();
  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(400, 'Selected category does not exist.');
}

async function assertTagsExist(
  supabase: SupabaseClient,
  tagIds: string[]
): Promise<void> {
  if (tagIds.length === 0) return;
  const { data, error } = await supabase
    .from('tags')
    .select('id')
    .in('id', tagIds);
  if (error) throw new ApiError(500, error.message);
  const found = new Set((data ?? []).map((t: { id: string }) => t.id));
  const missing = tagIds.filter((id) => !found.has(id));
  if (missing.length > 0) {
    throw new ApiError(400, 'One or more selected tags do not exist.');
  }
}

export async function createPost(
  supabase: SupabaseClient,
  authorId: string,
  input: PostInput
): Promise<AdminPost> {
  await assertCategoryExists(supabase, input.categoryId);
  await assertTagsExist(supabase, input.tagIds);

  const slug = await uniqueSlug(supabase, input.slug ?? slugify(input.title));
  const publishedAt =
    input.status === 'published' ? new Date().toISOString() : null;
  const readingTime = input.readingTime ?? calculateReadingTime(input.content);

  const { data: inserted, error: insertError } = await supabase
    .from('posts')
    .insert({
      slug,
      title: input.title,
      description: input.description,
      content: input.content,
      cover_image_url: input.coverImageUrl ?? null,
      author_id: authorId, // always the authenticated admin — never client data
      category_id: input.categoryId,
      published_at: publishedAt,
      reading_time: readingTime,
      featured: input.featured,
      trending: input.trending,
      status: input.status,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
    })
    .select('id')
    .single();

  if (insertError) {
    if (/duplicate key/i.test(insertError.message)) {
      throw new ApiError(409, 'A post with this slug already exists.');
    }
    throw new ApiError(500, insertError.message);
  }

  const postId = inserted?.id as string;
  const tagIds = Array.from(new Set(input.tagIds));

  if (tagIds.length > 0) {
    const { error: tagsError } = await supabase.from('post_tags').insert(
      tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId }))
    );
    if (tagsError) {
      // Clean up the partially-created post so no orphaned draft remains.
      await supabase.from('posts').delete().eq('id', postId);
      throw new ApiError(500, `Failed to attach tags: ${tagsError.message}`);
    }
  }

  return fetchPost(supabase, postId);
}

export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  input: PostInput
): Promise<AdminPost> {
  const existing = await fetchPost(supabase, id); // 404 when missing
  await assertCategoryExists(supabase, input.categoryId);
  await assertTagsExist(supabase, input.tagIds);

  const slug = await uniqueSlug(
    supabase,
    input.slug ?? slugify(input.title),
    id
  );

  // Publish -> set published_at once; unpublish -> clear it; otherwise keep.
  let publishedAt = existing.publishedAt;
  if (input.status === 'published' && !publishedAt) {
    publishedAt = new Date().toISOString();
  } else if (input.status === 'draft') {
    publishedAt = null;
  }

  const readingTime = input.readingTime ?? calculateReadingTime(input.content);

  const { error: updateError } = await supabase
    .from('posts')
    .update({
      slug,
      title: input.title,
      description: input.description,
      content: input.content,
      cover_image_url: input.coverImageUrl ?? null,
      category_id: input.categoryId,
      published_at: publishedAt,
      reading_time: readingTime,
      featured: input.featured,
      trending: input.trending,
      status: input.status,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
    })
    .eq('id', id);

  if (updateError) {
    if (/duplicate key/i.test(updateError.message)) {
      throw new ApiError(409, 'A post with this slug already exists.');
    }
    throw new ApiError(500, updateError.message);
  }

  // Replace the tag set. Note: author_id is intentionally never updated.
  //
  // The replacement is idempotent and concurrency-safe: instead of the old
  // delete-all-then-insert (which let two in-flight saves re-insert the same
  // (post_id, tag_id) rows and trip post_tags_pkey), we delete only the links
  // that are no longer selected and upsert the selected set with
  // ON CONFLICT DO NOTHING. Repeated or racing saves therefore can never
  // produce a duplicate-key error, and the primary key/RLS stay untouched.
  const newTagIds = Array.from(new Set(input.tagIds));
  const { data: oldLinks } = await supabase
    .from('post_tags')
    .select('tag_id')
    .eq('post_id', id);

  const removeLinks = supabase.from('post_tags').delete().eq('post_id', id);
  const removed =
    newTagIds.length === 0
      ? await removeLinks
      : await removeLinks.not('tag_id', 'in', newTagIds);

  if (removed.error) {
    throw new ApiError(500, `Failed to update tags: ${removed.error.message}`);
  }

  if (newTagIds.length > 0) {
    const { error: insertLinksError } = await supabase.from('post_tags').upsert(
      newTagIds.map((tagId) => ({ post_id: id, tag_id: tagId })),
      { onConflict: 'post_id,tag_id', ignoreDuplicates: true }
    );
    if (insertLinksError) {
      // Best-effort restore of the previous tag links (idempotent — the same
      // ON CONFLICT DO NOTHING upsert cannot itself duplicate rows).
      if (oldLinks && oldLinks.length > 0) {
        await supabase.from('post_tags').upsert(
          oldLinks.map((l: { tag_id: string }) => ({ post_id: id, tag_id: l.tag_id })),
          { onConflict: 'post_id,tag_id', ignoreDuplicates: true }
        );
      }
      throw new ApiError(
        500,
        `Failed to attach tags: ${insertLinksError.message}`
      );
    }
  }

  return fetchPost(supabase, id);
}

/** Deletes a post; post_tags rows are removed by the FK ON DELETE CASCADE. */
export async function deletePost(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, 'Post not found.');
}
