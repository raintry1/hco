import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Which cookies Hackers Colony Official uses and why.',
};

const sections = [
  {
    heading: 'Strictly necessary cookies',
    body: 'Supabase Auth session cookies keep you signed in and refresh your session. Without them, login and commenting cannot work. These are first-party and expire with your session.',
  },
  {
    heading: 'Preferences',
    body: 'We may store lightweight UI preferences (such as theme or dismissal of notices) in your browser. These never contain personal data.',
  },
  {
    heading: 'Analytics',
    body: 'If analytics is enabled in the future, it will be privacy-friendly and documented here. We do not use third-party advertising trackers.',
  },
  {
    heading: 'Managing cookies',
    body: 'You can block cookies in your browser settings, but signing in and commenting will stop working because the session cookie is required.',
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container-narrow max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
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
