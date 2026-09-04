import { NextRequest, NextResponse } from 'next/server';
import { requireAdminForRoute } from '@/lib/admin';
import { validatePostInput } from '@/lib/post-input';
import { listPosts, createPost, ApiError } from '@/lib/admin-posts';

function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error('[api/admin/posts]', err);
  return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
}

export async function GET() {
  const gated = await requireAdminForRoute();
  if ('response' in gated) return gated.response;
  try {
    const posts = await listPosts(gated.session.supabase);
    return NextResponse.json({ posts });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  const gated = await requireAdminForRoute();
  if ('response' in gated) return gated.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  const validated = validatePostInput(body);
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.errors.join(' ') },
      { status: 400 }
    );
  }

  try {
    const post = await createPost(
      gated.session.supabase,
      gated.session.user.id,
      validated.value
    );
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
