import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';

// Same-origin view counter for article pages.
//
// Browser -> this route -> one of two narrowly scoped database functions:
// - authenticated users: auth.uid() is derived from the Supabase session
// - anonymous users: a server-generated, signed HttpOnly cookie identifies the
//   visitor; its identity is never accepted from a request body or query
//
// Database uniqueness and row locking enforce one counted view per identity
// and post, including concurrent requests.
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VISITOR_ID_RE = /^[A-Za-z0-9_-]{43}$/;
const SIGNED_COOKIE_RE = /^([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{43})$/;
const ANONYMOUS_VIEW_COOKIE = 'hco_visitor_id';
const ANONYMOUS_VIEW_MAX_AGE = 60 * 60 * 24 * 365;

function getCookieSecret() {
  const secret = process.env.ANONYMOUS_VIEW_COOKIE_SECRET;

  if (!secret) {
    throw new Error('ANONYMOUS_VIEW_COOKIE_SECRET is not configured.');
  }

  return secret;
}

function signVisitorId(visitorId: string) {
  return createHmac('sha256', getCookieSecret())
    .update(visitorId)
    .digest('base64url');
}

function createVisitorCookieValue(visitorId: string) {
  return `${visitorId}.${signVisitorId(visitorId)}`;
}

function getVerifiedVisitorId(cookieValue: string | undefined) {
  if (!cookieValue) return undefined;

  const match = SIGNED_COOKIE_RE.exec(cookieValue);
  if (!match) return undefined;

  const [, visitorId, signature] = match;
  const expectedSignature = signVisitorId(visitorId);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return undefined;
  }

  return VISITOR_ID_RE.test(visitorId) ? visitorId : undefined;
}

function newVisitorId() {
  return randomBytes(32).toString('base64url');
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return jsonError('Invalid post id.', 400);
  }

  try {
    const userClient = createClient();
    const { data: userData, error: userError } = await userClient.auth.getUser();

    if (userError) {
      console.error('[api/content/posts/[id]/view] auth lookup failed', userError);
      return jsonError('Failed to identify viewer.', 500);
    }

    let data: { view_count: number; counted: boolean }[] | null;
    let error: { message: string } | null;
    let visitorId: string | undefined;
    let shouldSetVisitorCookie = false;

    if (userData.user) {
      // The authenticated RPC derives the identity from auth.uid(); no user ID
      // from the request is accepted or forwarded.
      ({ data, error } = await userClient.rpc('record_authenticated_post_view', {
        p_post_id: id,
      }));
    } else {
      const cookieStore = cookies();
      visitorId = getVerifiedVisitorId(cookieStore.get(ANONYMOUS_VIEW_COOKIE)?.value);

      // Ignore missing/forged values and issue a fresh server-generated ID.
      if (!visitorId) {
        visitorId = newVisitorId();
        shouldSetVisitorCookie = true;
      }

      // The service-role client is server-only and the anonymous RPC is not
      // executable by anon/authenticated roles. This prevents a browser from
      // invoking the anonymous identity function directly.
      ({ data, error } = await createAdminClient().rpc('record_anonymous_post_view', {
        p_post_id: id,
        p_visitor_id: visitorId,
      }));
    }

    if (error) {
      console.error('[api/content/posts/[id]/view]', error);
      return jsonError('Failed to record view.', 500);
    }

    // Both RPCs return one row for an existing published post, with counted
    // false when this identity has already viewed it.
    const rows = (data ?? []) as { view_count: number; counted: boolean }[];
    if (rows.length === 0) {
      return jsonError('Post not found.', 404);
    }

    const response = NextResponse.json(
      { viewCount: rows[0].view_count, counted: rows[0].counted },
      { headers: { 'Cache-Control': 'no-store' } }
    );

    if (shouldSetVisitorCookie && visitorId) {
      response.cookies.set(ANONYMOUS_VIEW_COOKIE, createVisitorCookieValue(visitorId), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ANONYMOUS_VIEW_MAX_AGE,
        path: '/',
      });
    }

    return response;
  } catch (err) {
    console.error('[api/content/posts/[id]/view]', err);
    return jsonError('Failed to record view.', 500);
  }
}
