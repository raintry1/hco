import { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Security',
  description: 'How Hackers Colony Official protects the platform, and how to report vulnerabilities.',
};

const email = siteConfig.links.email.replace('mailto:', '');

const practices = [
  {
    heading: 'Authentication',
    body: 'Passwordless Google OAuth via Supabase Auth. We never see or store your Google password, and sessions are refreshed server-side with HTTP-only handling.',
  },
  {
    heading: 'Database authorization',
    body: 'Access is enforced by Supabase row-level security, not just hidden UI. Users can only create, edit, or delete their own content; admin actions require the admin role checked inside the database.',
  },
  {
    heading: 'Transport & platform',
    body: 'HTTPS everywhere (Vercel + Render + Supabase). Secrets live in environment variables, never in the repository.',
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container-narrow max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Security</h1>
        <p className="text-muted-foreground mb-10">
          We practice what we publish. Here is how the platform is protected.
        </p>
        <div className="space-y-8">
          {practices.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold mb-2">{s.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </section>
          ))}
          <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-xl font-semibold mb-2">Report a vulnerability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Found a security issue in this site? Please do not disclose it publicly.
              Email <a className="underline hover:text-foreground" href={`mailto:${email}`}>{email}</a> with
              details and steps to reproduce — we will acknowledge within 48 hours and keep you credited if you wish.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
