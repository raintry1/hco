import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Sparkles, Zap, Newspaper, Mail, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Learn. Hack. Build. Grow Together.',
  description: 'Hackers Colony Official - A community-driven platform for developers and cybersecurity enthusiasts. AI guidance, video tutorials, and deep-dive security articles.',
  openGraph: {
    title: 'Hackers Colony Official',
    description: 'Learn. Hack. Build. Grow Together.',
    type: 'website',
  },
};

const features = [
  {
    icon: Sparkles,
    title: 'Nova AI',
    description: 'Ask anything about cybersecurity, Termux, or tech — Hinglish, Hindi or English.',
    href: '/ai',
    cta: 'Chat with Nova AI',
  },
  {
    icon: Zap,
    title: 'Bolt Video Bot',
    description: '80+ video tutorials and Termux commands. Type “menu” and learn.',
    href: '/chat',
    cta: 'Open Bolt Bot',
  },
  {
    icon: Newspaper,
    title: 'HCO Blog',
    description: 'Deep-dive articles on web security, crypto, reverse engineering and more.',
    href: '/blog',
    cta: 'Read articles',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join researchers and enthusiasts. Contact the team, join Discord.',
    href: '/contact',
    cta: 'Get in touch',
  },
];

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6" role="status">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Community-driven since 2023
            </div>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
            >
              Learn. Hack. Build. Grow Together.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              A community-driven platform for developers and cybersecurity enthusiasts. Share knowledge, discover vulnerabilities, and level up your skills.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/blog">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Explore Blog
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/login?register=true">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  Join Community
                  <Users className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Element */}
          <div className="mt-16 relative" aria-hidden="true">
            <div className="max-w-3xl mx-auto rounded-xl overflow-hidden border border-border bg-black/80 shadow-2xl shadow-purple-500/10">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-card/60">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">hacker@hco: ~</span>
              </div>
              <div className="relative p-6 sm:p-8 font-mono text-left text-xs sm:text-sm leading-7">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none" />
                <p className="relative"><span className="text-purple-400">hacker@hco</span><span className="text-muted-foreground">:~$ </span><span className="text-foreground">nmap -sV target.local</span></p>
                <p className="relative text-green-400/90">80/tcp open http &nbsp; 443/tcp open https</p>
                <p className="relative"><span className="text-purple-400">hacker@hco</span><span className="text-muted-foreground">:~$ </span><span className="text-foreground">sqlmap --crawl target.local</span></p>
                <p className="relative text-yellow-400/90">[!] parameter &apos;id&apos; looks injectable</p>
                <p className="relative"><span className="text-purple-400">hacker@hco</span><span className="text-muted-foreground">:~$ </span><span className="text-foreground">whoami</span></p>
                <p className="relative text-green-400/90">root access: knowledge<span className="inline-block w-2 h-4 ml-1 align-middle bg-green-400 animate-pulse" /></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="features-heading">
        <div className="container-narrow">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="features-heading" className="text-3xl font-bold">Explore the Colony</h2>
            <p className="text-muted-foreground mt-2">AI guidance, video tutorials, articles and community — everything in one place.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.href} className="h-full hover:border-primary/50 transition-colors group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground flex-1">{f.description}</p>
                  <Link href={f.href} className="text-primary hover:underline text-sm font-medium mt-4">
                    {f.cta} →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24" aria-labelledby="newsletter-heading">
        <div className="container-narrow">
          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-primary/20">
            <CardContent className="p-8 lg:p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Weekly Newsletter
                </div>
                <h2 id="newsletter-heading" className="text-3xl lg:text-4xl font-bold mb-4">
                  Stay Updated with the Latest Security Research
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Get curated articles, vulnerability writeups, and career advice delivered to your inbox every week. No spam, unsubscribe anytime.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/newsletter" method="GET">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-describedby="newsletter-help"
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    Subscribe
                    <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Button>
                </form>
                <p id="newsletter-help" className="text-xs text-muted-foreground mt-3">
                  By subscribing, you agree to our <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="stats-heading">
        <div className="container-narrow">
          <h2 id="stats-heading" className="sr-only">Community Statistics</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-muted-foreground mt-2">Articles Published</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
                12
              </div>
              <div className="text-muted-foreground mt-2">Categories</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
                2.5K+
              </div>
              <div className="text-muted-foreground mt-2">Community Members</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
                150K+
              </div>
              <div className="text-muted-foreground mt-2">Monthly Views</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
