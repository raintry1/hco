import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { getSupabase } from './supabase';

const app: Application = express();
// Render assigns PORT automatically; fall back to 4040 only for local dev.
const PORT = process.env.PORT || 4040;

// CORS allowlist. Server-to-server requests (the Next.js gateway, health
// checks, curl) carry no Origin header and are always allowed. Browser
// requests must come from a known frontend origin: localhost for local
// development, plus FRONTEND_URL / CORS_ORIGINS for deployed frontends
// (e.g. FRONTEND_URL=https://hackerscolony.vercel.app on Render).
const LOCAL_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://0.0.0.0:3000',
];
const envOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(
  new Set([
    ...LOCAL_DEV_ORIGINS,
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ...envOrigins,
  ])
);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header: non-browser / same-server request — allow.
      if (!origin) return callback(null, true);
      callback(null, allowedOrigins.includes(origin));
    },
  })
);
app.use(express.json());

// ---------------------------------------------------------------------------
// Public content API (Phase 2 — AGENTS.md starting point #5, read slice).
//
// Reads go through the Supabase anon key, so RLS governs exactly what is
// returned: anon sees only published posts and the public taxonomy. No write
// endpoints yet — those require an admin JWT and land with the admin tooling.
// ---------------------------------------------------------------------------

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  created_at: string;
};

type TagRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

type AuthorRow = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};

type PostRow = {
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
};

function supabaseUnavailable(res: Response, err: unknown) {
  console.error('[api] Supabase error:', err);
  return res.status(503).json({
    error: 'Service unavailable',
    message: err instanceof Error ? err.message : 'Supabase request failed',
  });
}

// GET /categories — all public categories (seeded 8).
app.get('/categories', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data as CategoryRow[] | null);
  } catch (err) {
    supabaseUnavailable(res, err);
  }
});

// GET /tags — all public tags (seeded 18).
app.get('/tags', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data as TagRow[] | null);
  } catch (err) {
    supabaseUnavailable(res, err);
  }
});

// GET /posts — published posts with category, tags and author embedded.
// PostgREST embeds: category via the categories FK, tags via the post_tags
// junction, author via the profiles_public view (which is what anon can read).
app.get('/posts', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
      .from('posts')
      .select(
        '*, category:categories(*), tags:post_tags(tag:tags(*)), author:profiles_public(*)'
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error) throw error;
    res.json(data as PostRow[] | null);
  } catch (err) {
    supabaseUnavailable(res, err);
  }
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📄 Content: GET /categories · GET /tags · GET /posts`);
});

export default app;