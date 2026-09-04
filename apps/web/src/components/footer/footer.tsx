import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { Twitter, Github, MessageCircle, Mail } from 'lucide-react';

type FooterLink = { label: string; href: string; external?: boolean };

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks: Record<string, FooterLink[]> = {
    Platform: [
      { label: 'Blog', href: '/blog' },
      { label: 'Categories', href: '/categories' },
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
    ],
    Community: [
      { label: 'Discord', href: siteConfig.links.discord, external: true },
      { label: 'Twitter', href: siteConfig.links.twitter, external: true },
      { label: 'GitHub', href: siteConfig.links.github, external: true },
      { label: 'Newsletter', href: '/newsletter' },
    ],
    Resources: [
      { label: 'Write for Us', href: '/write' },
      { label: 'Style Guide', href: '/style-guide' },
      { label: 'API Docs', href: '/api-docs' },
      { label: 'Status', href: '/status' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security', href: '/security' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: siteConfig.links.twitter, label: 'Twitter', external: true },
    { icon: Github, href: siteConfig.links.github, label: 'GitHub', external: true },
    { icon: MessageCircle, href: siteConfig.links.discord, label: 'Discord', external: true },
    { icon: Mail, href: 'mailto:hello@hco.dev', label: 'Email', external: true },
  ];

  return (
    <footer className="border-t bg-card" role="contentinfo">
      <div className="container-narrow py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Hackers Colony Official - Home">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
                HCO
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Learn. Hack. Build. Grow Together. A community-driven platform for developers and cybersecurity enthusiasts.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noopener noreferrer' : undefined}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            Built with Next.js, Tailwind CSS, and ❤️ by the HCO community.
          </p>
        </div>
      </div>
    </footer>
  );
}