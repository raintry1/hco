import { Metadata } from 'next';
import { NovaChat } from '@/components/ai/nova-chat';
import { requireUser } from '@/lib/require-user';

export const metadata: Metadata = {
  title: 'Nova AI',
  description: 'Chat with Nova AI — cybersecurity help in Hinglish, Hindi or English.',
};

export default async function NovaAIPage() {
  await requireUser('/ai');
  return (
    <div className="min-h-screen py-10 lg:py-14">
      <div className="container-narrow">
        <NovaChat />
        <p className="text-center text-xs text-muted-foreground mt-4">
          Nova AI can make mistakes — verify important commands in a lab first. ·{' '}
          <a href="/chat" className="underline hover:text-foreground">Video tutorials? Open Bolt Bot ⚡</a>
        </p>
      </div>
    </div>
  );
}
