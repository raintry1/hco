import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/api';

// Same-origin bridge for client components (the /search page).
//
// Browsers can never be assumed to reach the Express API directly:
// NEXT_PUBLIC_API_URL is the *server's* view of the API (e.g.
// http://localhost:4040), which a remote visitor's browser cannot resolve.
// This route performs the fetch server-side through the shared content
// gateway (lib/api) and serves the already-mapped posts over the site's own
// origin. There is deliberately no second data source or mapping layer — the
// gateway remains the single place that decides mock vs. live.
//
// Dynamic: the search page must reflect newly published posts on load rather
// than a build-time snapshot.
export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}
