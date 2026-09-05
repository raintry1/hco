import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Users, Shield, Code, Globe, Lock, Cpu, Bug, Server, Briefcase, Mail, ChevronRight, Flame, TrendingUp } from 'lucide-react';
import { getFeaturedPosts, getLatestPosts, getTrendingPosts, getCategories } from '@/lib/api';
import { BlogCard, FeaturedPostCard } from '@/components/cards/blog-card';
import { CategoryCard } from '@/components/cards/category-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Learn. Hack. Build. Grow Together.',
  description: 'Hackers Colony Official - A community-driven platform for developers and cybersecurity enthusiasts. Discover the latest in web security, cryptography, reverse engineering, and more.',
  openGraph: {
    title: 'Hackers Colony Official',
    description: 'Learn. Hack. Build. Grow Together.',
    type: 'website',
  },
};

const categoryIcons: Record<string, React.ReactNode> = {
  'web-security': <Shield className="h-5 w-5" />,
  'network-security': <Globe className="h-5 w-5" />,
  'cryptography': <Lock className="h-5 w-5" />,
  'reverse-engineering': <Cpu className="h-5 w-5" />,
  'malware-analysis': <Bug className="h-5 w-5" />,
  'devops-security': <Server className="h-5 w-5" />,
  'programming': <Code className="h-5 w-5" />,
  'career': <Briefcase className="h-5 w-5" />,
};

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts();
  const latestPosts = await getLatestPosts(6);
  const trendingPosts = (await getTrendingPosts()).slice(0, 5);
  const categories = (await getCategories()) ?? [];

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
              Now accepting article submissions
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
                  Browse Articles
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
            <div className="aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden border border-border bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
              <div className="relative p-8 flex items-center justify-center">
                <div className="text-center">
                  <Code className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                  <p className="text-muted-foreground">Terminal simulation placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPosts.length > 0 && (
        <section className="py-16 lg:py-24" aria-labelledby="featured-heading">
          <div className="container-narrow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="featured-heading" className="text-3xl font-bold">Featured Article</h2>
                <p className="text-muted-foreground mt-1">Hand-picked by our editors</p>
              </div>
              <Link href="/blog" className="text-primary hover:underline text-sm font-medium">
                View all →
              </Link>
            </div>
            <FeaturedPostCard post={featuredPosts[0]} />
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="py-16 lg:py-24" aria-labelledby="latest-heading">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="latest-heading" className="text-3xl font-bold">Latest Posts</h2>
              <p className="text-muted-foreground mt-1">Fresh content from the community</p>
            </div>
            <Link href="/blog" className="text-primary hover:underline text-sm font-medium">
              View all →
            </Link>
          </div>
          <BlogCardGrid posts={latestPosts} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="categories-heading">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="categories-heading" className="text-3xl font-bold">Browse Categories</h2>
              <p className="text-muted-foreground mt-1">Explore topics that interest you</p>
            </div>
            <Link href="/categories" className="text-primary hover:underline text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Posts */}
      {trendingPosts.length > 0 && (
        <section className="py-16 lg:py-24" aria-labelledby="trending-heading">
          <div className="container-narrow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="trending-heading" className="text-3xl font-bold flex items-center gap-2">
                  <Flame className="h-7 w-7 text-primary" aria-hidden="true" />
                  Trending
                </h2>
                <p className="text-muted-foreground mt-1">Most popular this week</p>
              </div>
            </div>
            <div className="space-y-4">
              {trendingPosts.map((post, index) => (
                <article key={post.id} className="flex gap-4 p-4 rounded-lg bg-card border hover:border-primary/50 transition-colors group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/blog/${post.slug}`} className="group">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        {post.readingTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                        {post.viewCount.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/newsletter" method="POST">
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

function BlogCardGrid({ posts }: { posts: any[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}