'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Send, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Msg {
  id: number;
  who: 'bot' | 'user';
  html: string;
}

const CHIPS = [
  'Termux kya hai? short me samjhao',
  'OTP bypass kaise hota hai?',
  'Bug bounty kaise start karu beginner ke liye?',
  'Kali Nethunter Android me kaise install kare?',
  'Phishing attack se kaise bache?',
];

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderText(text: string): string {
  return escapeHtml(text)
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s<]+|www\.[^\s<]+)/g, (url) => {
      const href = url.startsWith('http') ? url : `https://${url}`;
      return `<a href="${href}" target="_blank" rel="noopener" class="text-primary underline">${url}</a>`;
    });
}

function pickReply(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const keys = ['reply', 'message', 'response', 'text', 'content', 'answer', 'output'];
    for (const k of keys) {
      const v = (data as Record<string, unknown>)[k];
      if (typeof v === 'string' && v.trim()) return v;
    }
    return JSON.stringify(data);
  }
  return String(data);
}

let nextId = 1;

export function NovaChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      who: 'bot',
      html: renderText(
        "Hey! Main Nova AI hun 🤖 Cybersecurity, Termux, ya tech — kuch bhi pucho. Upar chips dabao ya neeche likho 😊"
      ),
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, busy]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setBusy(true);
    setLastQuery(q);
    setMsgs((prev) => [...prev, { id: nextId++, who: 'user', html: renderText(q) }]);
    setInput('');

    const thinkingId = nextId++;
    setMsgs((prev) => [...prev, { id: thinkingId, who: 'bot', html: '__thinking__' }]);

    try {
      const res = await fetch(`/api/ai/ask?q=${encodeURIComponent(q)}`);
      const data: unknown = await res.json();
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(String((data as Record<string, unknown>).error));
      }
      const reply = pickReply(data);
      setMsgs((prev) => prev.map((m) => (m.id === thinkingId ? { ...m, html: renderText(reply) } : m)));
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'request failed';
      setMsgs((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? { ...m, html: renderText(`Nova AI se connect nahi ho paya (${detail}). Retry dabao. 😅__retry__`) }
            : m
        )
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-primary/25 shadow-2xl shadow-purple-500/10">
        {/* Hero */}
        <div className="flex items-center gap-4 p-5 sm:p-6 bg-gradient-to-r from-purple-700/60 via-purple-500/25 to-fuchsia-500/40 border-b border-primary/30">
          <div className="shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center text-lg font-extrabold text-white bg-[radial-gradient(circle_at_30%_30%,#d8b4fe,#7e22ce_70%)] shadow-[0_0_24px_rgba(168,85,247,0.7)]">
            AI
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Nova AI</h1>
            <p className="text-sm text-purple-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
              Online — Hinglish · Hindi · English
            </p>
          </div>
          <Link href="/chat">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/25">
              ⚡ Bolt Bot
            </Button>
          </Link>
        </div>

        {/* Chips */}
        <div className="flex gap-2 px-4 pt-4 overflow-x-auto">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => void send(c)}
              disabled={busy}
              className="shrink-0 px-4 py-2 rounded-full text-xs text-purple-300 bg-primary/10 border border-primary/35 hover:bg-primary/25 hover:text-white transition-colors disabled:opacity-50"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="p-4 sm:p-5 space-y-4 min-h-[50vh]" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`flex gap-2.5 items-end max-w-[90%] ${m.who === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[0.7rem] font-extrabold ${
                  m.who === 'bot'
                    ? 'text-white bg-[radial-gradient(circle_at_30%_30%,#d8b4fe,#7e22ce_70%)]'
                    : 'text-purple-300 bg-muted border border-primary/40'
                }`}
              >
                {m.who === 'bot' ? 'AI' : 'You'}
              </div>
              <div className="min-w-0">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                    m.who === 'bot'
                      ? 'bg-card border border-primary/20 rounded-bl-md'
                      : 'bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-br-md'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: m.html === '__thinking__'
                      ? '<span class="inline-flex gap-1"><span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"></span><span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style="animation-delay:0.2s"></span><span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style="animation-delay:0.4s"></span></span>'
                      : m.html.replace('__retry__', ''),
                  }}
                />
                {m.html.includes('__retry__') && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 gap-1.5"
                    onClick={() => void send(lastQuery)}
                    disabled={busy}
                  >
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                    Retry
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          className="flex gap-2.5 p-4 border-t border-primary/20"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <label htmlFor="nova-input" className="sr-only">Ask Nova AI</label>
          <input
            id="nova-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nova AI se kuch pucho..."
            autoComplete="off"
            className="flex-1 px-5 py-3 rounded-full border border-primary/35 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <Button type="submit" size="icon" className="rounded-full w-12 h-12 shrink-0" disabled={busy || !input.trim()} aria-label="Send">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </Card>
    </div>
  );
}
