import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, User, Tag, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { getPostBySlug, getRelatedPosts, posts as allPosts } from '@/data/mock-data';
import { ArticleContent } from '@/components/blog/article-content';
import { ShareButtons } from '@/components/blog/share-buttons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getInitials, formatDate } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
      tags: post.tags.map(t => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
    other: {
      'article:author': post.author.name,
      'article:published_time': post.publishedAt,
      'article:modified_time': post.updatedAt || post.publishedAt,
      'article:section': post.category.name,
      'article:tag': post.tags.map(t => t.name).join(','),
    },
  };
}

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Ensure all relations are properly populated
  if (!post.category || !post.author) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.id, 3);

  const canonicalUrl = `${siteConfig.url}/blog/${post.slug}`;

  // Safe access to category properties with fallbacks
  const categoryColor = post.category.color || '#a855f7';
  const categorySlug = post.category.slug || 'web-security';
  const categoryName = post.category.name || 'Web Security';

  return (
    <article className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="border-b bg-card" aria-label="Breadcrumb" role="navigation">
        <div className="container-narrow py-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground" role="list">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/categories/${categorySlug}`} className="hover:text-foreground transition-colors">
                {categoryName}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Article Header */}
      <header className="py-12 lg:py-16">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Link
                href={`/categories/${categorySlug}`}
                className="text-xs font-medium px-3 py-1 rounded"
                style={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor,
                }}
              >
                {categoryName}
              </Link>
              {post.featured && (
                <Badge variant="purple" className="gap-1">
                  Featured
                </Badge>
              )}
              {post.trending && (
                <Badge variant="default" className="gap-1">
                  Trending
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {post.description}
            </p>

            {/* Author & Meta */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href={`/author/${post.author.slug}`} className="flex items-center gap-3 group">
                <Avatar className="h-12 w-12">
                  {post.author.avatar ? (
                    <AvatarImage src={post.author.avatar} alt="" />
                  ) : (
                    <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="text-left">
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {post.author.name}
                  </p>
                  {post.author.role && (
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                  )}
                </div>
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <time dateTime={post.publishedAt} className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {formatDate(post.publishedAt)}
                </time>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {post.readingTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  {post.viewCount.toLocaleString()} views
                </span>
              </div>
            </div>

            {/* Share Actions */}
            <ShareButtons title={post.title} url={canonicalUrl} />
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {post.coverImage && (
        <div className="relative w-full aspect-video max-h-[500px] overflow-hidden" aria-hidden="true">
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="container-narrow py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          <div className="max-w-3xl">
            <ArticleContent content={post.content} />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t flex flex-wrap items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/search?q=${tag.slug}`}
                      className="text-sm px-3 py-1 rounded bg-muted hover:bg-accent transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <Separator className="my-12" />
            <div className="flex gap-4">
              <Avatar className="h-16 w-16 flex-shrink-0">
                {post.author.avatar ? (
                  <AvatarImage src={post.author.avatar} alt="" />
                ) : (
                  <AvatarFallback className="text-xl">{getInitials(post.author.name)}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link href={`/author/${post.author.slug}`} className="font-semibold hover:text-primary transition-colors">
                    {post.author.name}
                  </Link>
                  {post.author.role && (
                    <Badge variant="secondary" className="text-xs">
                      {post.author.role}
                    </Badge>
                  )}
                </div>
                {post.author.bio && (
                  <p className="text-muted-foreground mb-3">{post.author.bio}</p>
                )}
                <div className="flex items-center gap-4">
                  {post.author.twitter && (
                    <a href={post.author.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>
                  )}
                  {post.author.github && (
                    <a href={post.author.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {post.author.website && (
                    <a href={post.author.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Website">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <section className="mt-16" aria-labelledby="related-heading">
                <h2 id="related-heading" className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {relatedPosts.map((relatedPost) => (
                    <article key={relatedPost.id} className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`} className="block">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.description}
                        </p>
                      </Link>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(relatedPost.publishedAt)}</span>
                        <span>{relatedPost.readingTime} min</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Comments Placeholder */}
            <section className="mt-16" aria-labelledby="comments-heading">
              <h2 id="comments-heading" className="text-2xl font-bold mb-6">Comments</h2>
              <Card>
                <CardContent className="p-8 text-center">
                  <svg className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Comments coming soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We&apos;re building a commenting system. Check back later!
                  </p>
                  <Button variant="outline" disabled>
                    Sign in to comment
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            {/* Table of Contents */}
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">On this page</h3>
                <nav aria-label="Table of contents">
                  <ol className="space-y-2 text-sm">
                    <li><a href="#introduction" className="text-muted-foreground hover:text-foreground transition-colors">Introduction</a></li>
                    <li><a href="#the-vulnerability" className="text-muted-foreground hover:text-foreground transition-colors">The Vulnerability</a></li>
                    <li><a href="#the-exploit" className="text-muted-foreground hover:text-foreground transition-colors">The Exploit</a></li>
                    <li><a href="#responsible-disclosure" className="text-muted-foreground hover:text-foreground transition-colors">Responsible Disclosure</a></li>
                    <li><a href="#lessons-learned" className="text-muted-foreground hover:text-foreground transition-colors">Lessons Learned</a></li>
                    <li><a href="#conclusion" className="text-muted-foreground hover:text-foreground transition-colors">Conclusion</a></li>
                  </ol>
                </nav>
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card className="mt-6 sticky top-24" style={{ top: 'calc(24rem + 1.5rem)' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14">
                    {post.author.avatar ? (
                      <AvatarImage src={post.author.avatar} alt="" />
                    ) : (
                      <AvatarFallback className="text-xl">{getInitials(post.author.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Link href={`/author/${post.author.slug}`} className="font-semibold hover:text-primary transition-colors">
                      {post.author.name}
                    </Link>
                    {post.author.role && <p className="text-sm text-muted-foreground">{post.author.role}</p>}
                  </div>
                </div>
                {post.author.bio && (
                  <p className="text-sm text-muted-foreground mb-4">{post.author.bio}</p>
                )}
                <div className="flex items-center gap-3">
                  {post.author.twitter && (
                    <a href={post.author.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>
                  )}
                  {post.author.github && (
                    <a href={post.author.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            image: post.coverImage ? [post.coverImage] : [],
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: {
              '@type': 'Person',
              name: post.author.name,
              url: `${siteConfig.url}/author/${post.author.slug}`,
            },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.name,
              logo: {
                '@type': 'ImageObject',
                url: `${siteConfig.url}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
          }),
        }}
      />
    </article>
  );
}