import { NextRequest, NextResponse } from 'next/server';
import { requireAdminForRoute } from '@/lib/admin';
import { validatePostInput } from '@/lib/post-input';
import { updatePost, deletePost, ApiError } from '@/lib/admin-posts';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error('[api/admin/posts]', err);
  return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
}

function invalidId(): NextResponse {
  return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gated = await requireAdminForRoute();
  if ('response' in gated) return gated.response;

  const { id } = await params;
  if (!UUID_RE.test(id)) return invalidId();

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
    const post = await updatePost(gated.session.supabase, id, validated.value);
    return NextResponse.json({ post });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gated = await requireAdminForRoute();
  if ('response' in gated) return gated.response;

  const { id } = await params;
  if (!UUID_RE.test(id)) return invalidId();

  try {
    await deletePost(gated.session.supabase, id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return errorResponse(err);
  }
}
