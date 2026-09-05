import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Filter, Grid, List } from 'lucide-react';
import { getPostsByCategory, getCategories } from '@/lib/api';
import { CategorySortSelect } from './category-sort-select';
import { BlogCard } from '@/components/cards/blog-card';
import { CategoryCard } from '@/components/cards/category-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/site-config';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

// This route reads searchParams (sort/page), which is incompatible with static
// generation: an SSG/ISR category route throws DYNAMIC_SERVER_USAGE whenever it
// renders on demand (e.g. a slug absent from generateStaticParams, or a build
// made while the API was down), and pre-rendered HTML can't honor ?sort=.
// Force server-side rendering so the page always renders correctly and can
// degrade gracefully when the API is unavailable.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();

  // Taxonomy unreachable — degrade with a neutral title (the page itself
  // renders a friendly state; it does not 404 valid categories).
  if (categories === null) {
    return { title: 'Categories' };
  }

  const category = categories.find(c => c.slug === slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: category.name,
    description: category.description || `Browse all articles in ${category.name}`,
    openGraph: {
      title: `${category.name} | ${siteConfig.name}`,
      description: category.description || `Browse all articles in ${category.name}`,
      type: 'website',
    },
  };}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort = 'latest', page = '1' } = await searchParams;
  const categories = await getCategories();

  // API unavailable (taxonomy could not be loaded) -> degrade with a friendly
  // state instead of 404-ing every valid category. This is the documented
  // gateway failure contract: an outage means empty/degraded content, never
  // "not found" for content that exists.
  if (categories === null) {
    return (
      <div className="min-h-screen">
        <div className="container-narrow py-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Category unavailable</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn&apos;t load this category right now. Please try again in
            a moment.
          </p>
        </div>
      </div>
    );
  }

  // Taxonomy loaded: an unknown slug is genuinely not found. A valid category
  // renders even with zero published posts — the grid below simply stays empty.
  const category = categories.find(c => c.slug === slug);
  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(slug);

  switch (sort) {
    case 'popular':
      posts.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'oldest':
      posts.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      break;
    case 'latest':
    default:
      posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      break;
  }

  const pageNum = parseInt(page, 10);
  const pageSize = 12;
  const totalPages = Math.ceil(posts.length / pageSize);
  const paginatedPosts = posts.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <header className="py-12 lg:py-16 border-b" style={{ backgroundColor: `${category.color}10` }}>
        <div className="container-narrow">
          <Link href="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            All Categories
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
              aria-hidden="true"
            >
              <span className="text-3xl" style={{ color: category.color }}>
                {category.icon === 'shield' && '🛡️'}
                {category.icon === 'globe' && '🌐'}
                {category.icon === 'lock' && '🔒'}
                {category.icon === 'cpu' && '⚙️'}
                {category.icon === 'bug' && '🐛'}
                {category.icon === 'server' && '🖥️'}
                {category.icon === 'code' && '💻'}
                {category.icon === 'briefcase' && '💼'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground mt-1">{category.description || `${posts.length} articles in this category`}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </Badge>
            {category.postCount && category.postCount !== posts.length && (
              <Badge variant="outline" className="text-xs">
                {category.postCount} total
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Posts Grid */}
      <div className="container-narrow py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="sr-only">Sort posts</label>
            <CategorySortSelect sort={sort} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="List view">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                {pageNum > 1 && (
                  <Link
                    href={`/categories/${slug}?sort=${sort}&page=${pageNum - 1}`}
                    className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
                    aria-label="Previous page"
                  >
                    Previous
                  </Link>
                )}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/categories/${slug}?sort=${sort}&page=${p}`}
                      className={`px-3 py-2 rounded-md text-sm transition-colors ${
                        p === pageNum
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                      aria-label={p === pageNum ? `Page ${p}, current` : `Page ${p}`}
                      aria-current={p === pageNum ? 'page' : undefined}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
                {pageNum < totalPages && (
                  <Link
                    href={`/categories/${slug}?sort=${sort}&page=${pageNum + 1}`}
                    className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
                    aria-label="Next page"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <svg className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20 13c0 5.523-4.477 10-10 10S0 18.523 0 13 4.477 3 10 3s10 4.477 10 10z" />
              <path d="M10 13V9" />
              <path d="M10 17h.01" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No articles found</h2>
            <p className="text-muted-foreground">There are no articles in this category yet.</p>
          </div>
        )}

        {/* Other Categories */}
        <section className="mt-16" aria-labelledby="other-categories-heading">
          <h2 id="other-categories-heading" className="text-2xl font-bold mb-6">Explore Other Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories
              .filter(c => c.slug !== slug)
              .slice(0, 8)
              .map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/categories" className="text-primary hover:underline font-medium">
              View all categories →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}