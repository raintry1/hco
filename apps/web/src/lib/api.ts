import type { Category, Tag, PostWithRelations } from '@hco/shared';
import { slugify } from '@/lib/utils';
import {
  categories as mockCategories,
  tags as mockTags,
  posts as mockPosts,
} from '@/data/mock-data';

/**
 * Single content-fetching gateway for HCO pages.
 *
 * Every content page imports from here — never from mock-data and never from
 * Supabase directly. The gateway switches between two sources:
 *
 *   - MOCK mode (default): returns the Phase 1 mock data so the site keeps
 *     rendering today's UI while the `posts` table is still empty (Phase 2D
 *     mock-post migration is intentionally deferred).
 *   - LIVE mode: fetches from the Express content API (apps/api) with ISR
 *     caching. Flip by setting NEXT_PUBLIC_USE_MOCK_DATA=false once real
 *     posts exist.
 *
 * Both modes return the exact same `@hco/shared` camelCase shapes, and the
 * query helpers below run identical pure filters over either source, so page
 * behavior is preserved across the switch. All functions are async and never
 * throw — failures degrade to empty results.
 */

// ---- Mock / live switch --------------------------------------------------
// NEXT_PUBLIC_USE_MOCK_DATA=false switches to the live API. Anything else
// (including unset) means mock mode.
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

// ---- Internal row shapes (mirror the API responses, snake_case) ----------

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  created_at: string;
}

interface TagRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface AuthorRow {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

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
  category: CategoryRow | null;
  tags: { tag: TagRow }[];
  author: AuthorRow | null;
}

// ---- Live transport ------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_SECONDS = 60;
const REQUEST_TIMEOUT_MS = 10_000;

async function fetchJson<T>(path: string): Promise<T[] | null> {
  if (!API_URL) {
    console.warn('[api] NEXT_PUBLIC_API_URL is not set; returning empty result.');
    return null;
  }

  try {
    // Next.js fetch caching (`next.revalidate`) only applies server-side.
    // On the client (e.g. the search page) it is a no-op, so omit it there.
    const init: RequestInit = {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    };
    if (typeof window === 'undefined') {
      init.next = { revalidate: REVALIDATE_SECONDS };
    }

    const res = await fetch(`${API_URL}${path}`, init);

    if (!res.ok) {
      console.warn(`[api] ${path} responded ${res.status}; returning empty result.`);
      return null;
    }

    const json: unknown = await res.json();
    return Array.isArray(json) ? (json as T[]) : null;
  } catch (err) {
    console.warn(`[api] request to ${path} failed; returning empty result.`, err);
    return null;
  }
}

// ---- Mappers: API snake_case rows -> shared camelCase types --------------

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    color: row.color ?? undefined,
    icon: row.icon ?? undefined,
    // postCount is display-only and not stored in the DB — left undefined.
    createdAt: row.created_at,
  };
}

function mapTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
  };
}

function mapAuthor(row: AuthorRow): PostWithRelations['author'] {
  return {
    id: row.id,
    name: row.display_name,
    // profiles_public has no author slug; fall back to the username, else a
    // slugified display name so /author/[slug] links keep working.
    slug: row.username ?? slugify(row.display_name),
    avatar: row.avatar_url ?? undefined,
    bio: row.bio ?? undefined,
    // role/twitter/github/website are not exposed by profiles_public.
    createdAt: row.created_at,
  };
}

function mapPost(row: PostRow): PostWithRelations {
  // The FK + RLS guarantee these embeds resolve for published posts, but the
  // API types them nullable — fall back defensively rather than crash.
  const author = row.author
    ? mapAuthor(row.author)
    : {
        id: row.author_id,
        name: 'HCO Contributor',
        slug: 'hco-contributor',
        createdAt: row.updated_at,
      };
  const category = row.category
    ? mapCategory(row.category)
    : {
        id: row.category_id,
        name: 'Uncategorized',
        slug: 'uncategorized',
        createdAt: row.updated_at,
      };

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    coverImage: row.cover_image_url ?? undefined,
    authorId: row.author_id,
    categoryId: row.category_id,
    tagIds: row.tags.map((t) => t.tag.id),
    publishedAt: row.published_at ?? row.updated_at,
    updatedAt: row.updated_at,
    readingTime: row.reading_time,
    viewCount: row.view_count,
    featured: row.featured,
    trending: row.trending,
    status: row.status,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    author,
    category,
    tags: row.tags.map((t) => mapTag(t.tag)),
  };
}

// ---- Sources: mock (default) or live API --------------------------------

async function getCategoriesSource(): Promise<Category[] | null> {
  if (USE_MOCK_DATA) return mockCategories;
  const rows = await fetchJson<CategoryRow>('/categories');
  // Preserve null (API unavailable / errored) so callers can distinguish
  // "couldn't load the taxonomy" from "there are no categories" — the
  // category page must degrade instead of treating an API outage as an
  // empty dataset (which would make every valid category look "not found").
  return rows ? rows.map(mapCategory) : null;
}

async function getTagsSource(): Promise<Tag[]> {
  if (USE_MOCK_DATA) return mockTags;
  const rows = await fetchJson<TagRow>('/tags');
  return (rows ?? []).map(mapTag);
}

/** Published posts with relations. Mock: the 6 mock posts. Live: API ([]) today. */
async function getPostsSource(): Promise<PostWithRelations[]> {
  if (USE_MOCK_DATA) return mockPosts;
  const rows = await fetchJson<PostRow>('/posts');
  return (rows ?? []).map(mapPost);
}

// ---- Pure filters shared by both modes -----------------------------------
// Semantics mirror the equivalent functions in apps/web/src/data/mock-data.ts
// so the mock -> live switch is behavior-identical.

function publishedOnly(posts: PostWithRelations[]): PostWithRelations[] {
  return posts.filter((p) => p.status === 'published');
}

/** Full-text search across title, description, content, tags, category, author. */
export function searchInPosts(
  posts: PostWithRelations[],
  query: string
): PostWithRelations[] {
  const lowerQuery = query.toLowerCase();
  return publishedOnly(posts).filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.name.toLowerCase().includes(lowerQuery)) ||
      p.category.name.toLowerCase().includes(lowerQuery) ||
      p.author.name.toLowerCase().includes(lowerQuery)
  );
}

// ---- Public gateway API --------------------------------------------------

/**
 * All categories (mock: with postCount; live: without). Never throws.
 * Returns null only in live mode when the API is unreachable or errored, so
 * callers can tell "couldn't load" apart from "no categories exist". Use
 * `?? []` where an empty dataset is the correct degradation; use the null
 * check where a missing taxonomy must NOT look like an empty one.
 */
export async function getCategories(): Promise<Category[] | null> {
  return getCategoriesSource();
}

/** All tags. Never throws. */
export async function getTags(): Promise<Tag[]> {
  return getTagsSource();
}

/** All published posts with relations. Never throws. */
export async function getPosts(): Promise<PostWithRelations[]> {
  return getPostsSource();
}

/** Posts flagged featured. Never throws. */
export async function getFeaturedPosts(): Promise<PostWithRelations[]> {
  return (await getPostsSource()).filter((p) => p.featured);
}

/** Most recent published posts, newest first. Never throws. */
export async function getLatestPosts(limit = 10): Promise<PostWithRelations[]> {
  return publishedOnly(await getPostsSource())
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

/** Posts flagged trending. Never throws. */
export async function getTrendingPosts(): Promise<PostWithRelations[]> {
  return (await getPostsSource()).filter((p) => p.trending);
}

/** Published posts in a category (matched by slug). Never throws. */
export async function getPostsByCategory(
  categorySlug: string
): Promise<PostWithRelations[]> {
  return publishedOnly(await getPostsSource()).filter(
    (p) => p.category.slug === categorySlug
  );
}

/** A single post by slug, or null. Never throws. */
export async function getPostBySlug(
  slug: string
): Promise<PostWithRelations | null> {
  const post = (await getPostsSource()).find((p) => p.slug === slug);
  return post ?? null;
}

/** Related posts sharing the category or any tag. Never throws. */
export async function getRelatedPosts(
  postId: string,
  limit = 3
): Promise<PostWithRelations[]> {
  const all = await getPostsSource();
  const post = all.find((p) => p.id === postId);
  if (!post) return [];

  return all
    .filter(
      (p) =>
        p.id !== postId &&
        (p.categoryId === post.categoryId ||
          p.tagIds.some((t) => post.tagIds.includes(t)))
    )
    .slice(0, limit);
}