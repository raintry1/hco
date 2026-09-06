import { Metadata } from 'next';
import { BoltChat } from '@/components/ai/bolt-chat';
import { requireUser } from '@/lib/require-user';

export const metadata: Metadata = {
  title: 'Bolt Video Bot',
  description: 'Ask Bolt — 80+ ethical hacking video tutorials and Termux commands.',
};

export default async function BoltPage() {
  await requireUser('/chat');
  return (
    <div className="min-h-screen py-10 lg:py-14">
      <div className="container-narrow">
        <BoltChat />
        <p className="text-center text-xs text-muted-foreground mt-4">
          Tutorials are for education on your own systems. ·{' '}
          <a href="/ai" className="underline hover:text-foreground">Smart answers? Ask Nova AI ✨</a>
        </p>
      </div>
    </div>
  );
}
