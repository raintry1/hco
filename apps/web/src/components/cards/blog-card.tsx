'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, Flame, Star } from 'lucide-react';
import { cn, formatDate, getInitials } from '@/lib/utils';
import { PostWithRelations } from '@hco/shared';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BlogCardProps {
  post: PostWithRelations;
  variant?: 'default' | 'featured' | 'compact' | 'trending';
  showCategory?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  showViews?: boolean;
}

export function BlogCard({
  post,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showDate = true,
  showReadingTime = true,
  showViews = true,
}: BlogCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const isTrending = variant === 'trending';

  return (
    <article className={cn('flex flex-col', isFeatured && 'h-full')}>
      {post.coverImage && (
        <Link
          href={`/blog/${post.slug}`}
          className={cn(
            'relative overflow-hidden rounded-t-lg',
            isFeatured ? 'aspect-video' : 'aspect-[4/3]'
          )}
          aria-label={`Read "${post.title}"`}
        >
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes={isFeatured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            loading={isFeatured ? 'eager' : 'lazy'}
          />
          {(post.featured || post.trending) && (
            <div className="absolute top-3 left-3 flex gap-1">
              {post.featured && (
                <Badge variant="purple" className="gap-1">
                  <Star className="h-3 w-3" aria-hidden="true" />
                  Featured
                </Badge>
              )}
              {post.trending && (
                <Badge variant="default" className="gap-1">
                  <Flame className="h-3 w-3" aria-hidden="true" />
                  Trending
                </Badge>
              )}
            </div>
          )}
        </Link>
      )}

      <div className={cn('flex flex-1 flex-col', isFeatured ? 'p-6' : 'p-4')}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {showCategory && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${post.category.color}20`,
                color: post.category.color,
              }}
            >
              {post.category.name}
            </Link>
          )}
          {showDate && (
            <time dateTime={post.publishedAt} className="text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </time>
          )}
        </div>

        <Link href={`/blog/${post.slug}`} className="group">
          <h2
            className={cn(
              'font-semibold leading-tight transition-colors group-hover:text-primary',
              isFeatured ? 'text-2xl mb-3' : 'text-lg mb-2',
              isCompact ? 'text-base' : ''
            )}
          >
            {post.title}
          </h2>
        </Link>

        {!isCompact && (
          <p className={cn('text-muted-foreground mb-4', isFeatured ? 'text-base' : 'text-sm')}>
            {post.description}
          </p>
        )}

        {showAuthor && (
          <div className="mt-auto flex items-center gap-3 pt-4 border-t">
            <Link href={`/author/${post.author.slug}`} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {post.author.avatar ? (
                  <AvatarImage src={post.author.avatar} alt="" />
                ) : (
                  <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium truncate">{post.author.name}</span>
            </Link>

            <div className="flex-1 flex items-center justify-end gap-4 text-xs text-muted-foreground">
              {showReadingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {post.readingTime} min
                </span>
              )}
              {showViews && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  {post.viewCount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function BlogCardGrid({ posts }: { posts: PostWithRelations[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export function FeaturedPostCard({ post }: { post: PostWithRelations }) {
  return <BlogCard post={post} variant="featured" />;
}

export function CompactPostCard({ post }: { post: PostWithRelations }) {
  return (
    <BlogCard
      post={post}
      variant="compact"
      showCategory={false}
      showDate={false}
      showReadingTime={false}
      showViews={false}
    />
  );
}