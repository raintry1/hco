import { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Hackers Colony Official collects, uses, and protects your data.',
};

const sections = [
  {
    heading: 'Data we collect',
    body: 'When you sign in with Google, we receive your name, email address, and profile picture from your Google account. We also store your comments and profile details you choose to add. We do not collect passwords or payment information.',
  },
  {
    heading: 'How we use it',
    body: 'Your data is used to operate your account, display your comments and profile, and send the newsletter you subscribe to. We never sell your personal data to third parties.',
  },
  {
    heading: 'Authentication & storage',
    body: 'Sign-in is handled by Supabase Auth with Google OAuth. Your data is stored in our Supabase Postgres database with row-level security so only you (and admins, where needed) can manage your own content.',
  },
  {
    heading: 'Cookies',
    body: 'We use strictly necessary cookies to keep you signed in. See our Cookie Policy for details.',
  },
  {
    heading: 'Your rights',
    body: 'You can edit your profile at any time from the profile page, delete your own comments, and request account deletion by emailing us.',
  },
  {
    heading: 'Contact',
    body: `Questions about privacy? Email us at ${siteConfig.links.email.replace('mailto:', '')}.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container-narrow max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: September 2026</p>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold mb-2">{s.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
