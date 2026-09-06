import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Flame, TrendingUp } from 'lucide-react';
import { getFeaturedPosts, getLatestPosts, getTrendingPosts, getCategories } from '@/lib/api';
import { BlogCard, FeaturedPostCard } from '@/components/cards/blog-card';
import { CategoryCard } from '@/components/cards/category-card';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Deep-dive articles on web security, cryptography, reverse engineering, malware analysis and more.',
};

export default async function BlogPage() {
  const featuredPosts = await getFeaturedPosts();
  const latestPosts = await getLatestPosts(9);
  const trendingPosts = (await getTrendingPosts()).slice(0, 5);
  const categories = (await getCategories()) ?? [];

  return (
    <div className="flex flex-col">
      <section className="py-16 lg:py-20 border-b" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
        <div className="container-narrow text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">HCO Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical security research — web security, cryptography, reverse engineering, DevSecOps and careers.
          </p>
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
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
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
    </div>
  );
}
