import Link from 'next/link';
import { PlusCircle, FileText, Calendar, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { listPosts } from '@/lib/admin-posts';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeletePostButton } from './post-actions';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const supabase = createClient();
  const posts = await listPosts(supabase);

  return (
    <div className="py-12">
      <div className="container-narrow">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Posts</h1>
              <p className="text-muted-foreground mt-1">
                Create, edit and publish articles. Drafts are only visible to admins.
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/admin/posts/new">
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                New Post
              </Link>
            </Button>
          </div>

          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
                <p className="text-muted-foreground mb-6">
                  Write your first article — it can stay a draft until you&apos;re
                  ready to publish.
                </p>
                <Button asChild>
                  <Link href="/admin/posts/new" className="gap-2">
                    <PlusCircle className="h-4 w-4" aria-hidden="true" />
                    Create your first post
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {post.status === 'published' ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                          {post.featured && <Badge variant="purple">Featured</Badge>}
                          {post.trending && <Badge>Trending</Badge>}
                          {post.categoryName && (
                            <Badge variant="outline">{post.categoryName}</Badge>
                          )}
                        </div>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1 font-mono">
                            /blog/{post.slug}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {post.readingTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            {post.publishedAt
                              ? `Published ${formatDate(post.publishedAt)}`
                              : 'Not published yet'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                        </Button>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
