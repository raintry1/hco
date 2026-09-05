import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Same-origin view counter for article pages.
//
// Browser -> this route -> Supabase RPC public.increment_post_view(post_id)
// (a SECURITY DEFINER function). The route uses only the anon-key server
// client (never the service-role key), and the RPC is the ONLY write the
// client is allowed to perform: direct UPDATEs of posts.view_count remain
// rejected by RLS. The increment is atomic inside the function.
//
// Dynamic: every visit must hit the database — never cache this.
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('increment_post_view', {
      post_id: id,
    });

    if (error) {
      console.error('[api/content/posts/[id]/view]', error);
      return NextResponse.json(
        { error: 'Failed to record view.' },
        { status: 500 }
      );
    }

    // The RPC is a set-returning function: one row per incremented post.
    // Zero rows means the post does not exist or is not published.
    const rows = (data ?? []) as { view_count: number }[];
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ viewCount: rows[0].view_count });
  } catch (err) {
    console.error('[api/content/posts/[id]/view]', err);
    return NextResponse.json(
      { error: 'Failed to record view.' },
      { status: 500 }
    );
  }
}