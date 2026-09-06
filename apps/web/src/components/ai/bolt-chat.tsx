'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getBoltReply } from '@/lib/bolt-content';

interface Msg {
  id: number;
  who: 'bot' | 'user';
  text: string;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderText(text: string): string {
  return escapeHtml(text)
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s<]+|www\.[^\s<]+)/g, (url) => {
      const href = url.startsWith('http') ? url : `https://${url}`;
      return `<a href="${href}" target="_blank" rel="noopener" class="text-cyan-400 underline">${url}</a>`;
    });
}

let nextId = 1;

export function BoltChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, who: 'bot', text: "Yo! I'm Bolt ⚡ video tutorials chahiye? 'menu' likho aur bhej do." },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const reply = getBoltReply(q);
    setMsgs((prev) => [
      ...prev,
      { id: nextId++, who: 'user', text: q },
      { id: nextId++, who: 'bot', text: reply },
    ]);
    setInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-cyan-500/25 shadow-2xl shadow-cyan-500/10">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 sm:p-6 bg-gradient-to-r from-cyan-700/60 via-cyan-500/25 to-sky-500/40 border-b border-cyan-500/30">
          <div className="shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center text-lg font-extrabold text-black bg-[radial-gradient(circle_at_30%_30%,#a5f3fc,#0e7490_70%)] shadow-[0_0_24px_rgba(34,211,238,0.7)]">
            B
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Bolt · Video Bot</h1>
            <p className="text-sm text-cyan-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
              Online — 80+ video tutorials
            </p>
          </div>
          <Link href="/ai">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/25">
              ✨ Nova AI
            </Button>
          </Link>
        </div>

        {/* Quick Guide */}
        <div className="px-4 pt-4 text-xs text-muted-foreground">
          Type <code className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">menu</code> to see all video tutorials, or just describe what you need.
        </div>

        {/* Messages */}
        <div className="p-4 sm:p-5 space-y-4 min-h-[50vh]" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`flex gap-2.5 items-end max-w-[90%] ${m.who === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[0.7rem] font-extrabold ${
                  m.who === 'bot'
                    ? 'text-black bg-[radial-gradient(circle_at_30%_30%,#a5f3fc,#0e7490_70%)]'
                    : 'text-cyan-300 bg-muted border border-cyan-500/40'
                }`}
              >
                {m.who === 'bot' ? 'B' : 'You'}
              </div>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                  m.who === 'bot'
                    ? 'bg-card border border-cyan-500/20 border-l-[3px] border-l-cyan-400 rounded-bl-md'
                    : 'bg-gradient-to-r from-cyan-700 to-cyan-500 text-white rounded-br-md'
                }`}
                dangerouslySetInnerHTML={{ __html: renderText(m.text) }}
              />
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          className="flex gap-2.5 p-4 border-t border-cyan-500/20"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="bolt-input" className="sr-only">Message Bolt</label>
          <input
            id="bolt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'menu' or ask for a tutorial..."
            autoComplete="off"
            className="flex-1 px-5 py-3 rounded-full border border-cyan-500/35 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
          />
          <Button type="submit" size="icon" className="rounded-full w-12 h-12 shrink-0 bg-cyan-500 hover:bg-cyan-400 text-black" disabled={!input.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}

