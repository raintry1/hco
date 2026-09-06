import { Metadata } from 'next';
import { Mail, Phone, Instagram, MessageCircle, Github, Twitter, Facebook, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Hackers Colony Official team and join the community.',
};

const channels = [
  { icon: Mail, label: 'Email', value: 'hackerscolonynew@gmail.com', href: 'mailto:hackerscolonynew@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+91 84206 11159', href: 'tel:+918420611159' },
  { icon: Instagram, label: 'Instagram', value: '@hackers_colony_official', href: 'https://instagram.com/hackers_colony_official' },
  { icon: Twitter, label: 'X (Twitter)', value: '@Hackers_Colony', href: siteConfig.links.twitter },
  { icon: Github, label: 'GitHub', value: 'Hackerscolonyofficial', href: siteConfig.links.github },
  { icon: MessageCircle, label: 'Discord', value: 'Join the server', href: siteConfig.links.discord },
  { icon: Facebook, label: 'Facebook', value: 'Hackers Colony', href: siteConfig.links.facebook },
  { icon: Send, label: 'Newsletter', value: 'Weekly security research', href: '/newsletter' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container-narrow max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact & Community</h1>
          <p className="text-muted-foreground text-lg">
            Questions, feedback, or want to contribute? Reach us on any channel below.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((c) => (
            <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <c.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{c.label}</p>
                    <p className="font-medium truncate">{c.value}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
