import { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Rules for using the Hackers Colony Official platform.',
};

const sections = [
  {
    heading: 'Acceptable use',
    body: 'Content is for education and authorized security research only. Do not use anything you learn here against systems you do not own or have explicit permission to test.',
  },
  {
    heading: 'Your account',
    body: 'You sign in with Google and are responsible for activity under your account. Keep your Google account secure and do not impersonate others.',
  },
  {
    heading: 'Comments & conduct',
    body: 'Be respectful. No spam, harassment, hate speech, malware distribution, or instructions facilitating wrongdoing. We may remove violating content and restrict accounts.',
  },
  {
    heading: 'Intellectual property',
    body: 'Articles remain the property of their authors and HCO. Do not republish full articles without permission; short quotes with attribution are fine.',
  },
  {
    heading: 'No warranties',
    body: 'Content is provided as-is for educational purposes. Techniques change fast — always verify against current documentation and test in isolated lab environments.',
  },
  {
    heading: 'Contact',
    body: `Questions about these terms? Email us at ${siteConfig.links.email.replace('mailto:', '')}.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container-narrow max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
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
