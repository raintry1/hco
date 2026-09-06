import { NextResponse } from 'next/server';

// Server-side AI proxy. The Klyphic token stays on the server (never exposed
// to the browser) and same-origin calls avoid CORS issues entirely.
// Requires KLYPHIC_TOKEN in the environment (Vercel env vars / .env.local).
const SYSTEM_PROMPT = [
  'You are HCO AI, a helpful assistant.',
  'Answer clearly, factually, and directly.',
  'When you do not know something, say so honestly instead of fabricating information.',
  'Reply in the same language the user messages in.',
  'Use emojis to keep responses friendly and positive.',
  'End every response with: HCO AI',
].join(' ');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();

  if (!q) {
    return NextResponse.json({ error: 'empty query' }, { status: 400 });
  }

  const token = process.env.KLYPHIC_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'AI not configured yet (server is missing KLYPHIC_TOKEN).' },
      { status: 500 }
    );
  }

  const target =
    `https://apis.klyphic.in/klygen?token=${encodeURIComponent(token)}` +
    `&q=${encodeURIComponent(q)}&sys_prompt=${encodeURIComponent(SYSTEM_PROMPT)}`;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90000);
    let upstream: Response;
    try {
      upstream = await fetch(target, { signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI request failed' },
      { status: 502 }
    );
  }
}
