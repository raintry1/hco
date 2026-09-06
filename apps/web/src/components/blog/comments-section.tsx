'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { getInitials, formatDate } from '@/lib/utils';

interface CommentRow {
  id: string;
  post_slug: string;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  body: string;
  created_at: string;
}

const MAX_LENGTH = 2000;

function displayName(user: User): string {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  for (const key of ['full_name', 'name', 'display_name']) {
    const v = meta[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return user.email ?? 'HCO Member';
}

function avatarUrl(user: User): string | null {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  for (const key of ['avatar_url', 'picture']) {
    const v = meta[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

export function CommentsSection({ postSlug }: { postSlug: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableMissing, setTableMissing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('comments')
        .select('id, post_slug, user_id, author_name, author_avatar, body, created_at')
        .eq('post_slug', postSlug)
        .order('created_at', { ascending: true });

      if (error) {
        // 42P01 = table does not exist (migration not applied yet).
        if (error.code === '42P01') {
          setTableMissing(true);
        } else {
          setLoadError('Could not load comments. Please refresh the page.');
        }
        return;
      }
      setComments((data ?? []) as CommentRow[]);
    } catch {
      setLoadError('Comments are unavailable right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    let active = true;
    try {
      const supabase = createClient();
      supabase.auth
        .getUser()
        .then(({ data }) => {
          if (active) {
            setUser(data.user);
            setAuthChecked(true);
          }
        })
        .catch(() => {
          if (active) setAuthChecked(true);
        });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) setUser(session?.user ?? null);
      });
      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } catch {
      if (active) setAuthChecked(true);
      return undefined;
    }
  }, []);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const handlePost = async () => {
    const text = body.trim();
    if (!text || !user || posting) return;
    setPosting(true);
    setPostError('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_slug: postSlug,
          user_id: user.id,
          author_name: displayName(user),
          author_avatar: avatarUrl(user),
          body: text.slice(0, MAX_LENGTH),
        })
        .select('id, post_slug, user_id, author_name, author_avatar, body, created_at')
        .single();

      if (error || !data) {
        setPostError(error?.message ?? 'Could not post your comment. Please try again.');
        return;
      }
      setComments((prev) => [...prev, data as CommentRow]);
      setBody('');
    } catch {
      setPostError('Could not post your comment. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) return;
      setComments((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-16" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-2xl font-bold mb-6">
        Comments{comments.length > 0 ? ` (${comments.length})` : ''}
      </h2>

      {loading ? (
        <Card>
          <CardContent className="p-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Loading comments…
          </CardContent>
        </Card>
      ) : tableMissing ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">Comments launching soon</h3>
            <p className="text-muted-foreground">
              We&apos;re finishing the setup on our side. Check back shortly!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loadError && (
            <p role="alert" className="text-sm text-destructive">{loadError}</p>
          )}

          {comments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                <p className="text-muted-foreground">Be the first to share your thoughts!</p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-9 w-9">
                      {comment.author_avatar ? (
                        <AvatarImage src={comment.author_avatar} alt="" />
                      ) : (
                        <AvatarFallback>{getInitials(comment.author_name || 'H')}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {comment.author_name || 'HCO Member'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                    {user && user.id === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        aria-label="Delete your comment"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        {deletingId === comment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {comment.body}
                  </p>
                </CardContent>
              </Card>
            ))
          )}

          {/* Composer */}
          {authChecked && !user ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Join the discussion — sign in to post a comment.
                </p>
                <Link href="/login">
                  <Button>Sign in to comment</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            authChecked && (
              <Card>
                <CardContent className="p-5">
                  <label htmlFor="comment-body" className="sr-only">Write a comment</label>
                  <textarea
                    id="comment-body"
                    value={body}
                    onChange={(e) => setBody(e.target.value.slice(0, MAX_LENGTH))}
                    placeholder={`Comment as ${user ? displayName(user) : '…'}`}
                    rows={3}
                    maxLength={MAX_LENGTH}
                    className="w-full px-4 py-3 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[88px]"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">
                      {body.length}/{MAX_LENGTH}
                    </span>
                    {postError && (
                      <p role="alert" className="text-xs text-destructive flex-1 mx-3">{postError}</p>
                    )}
                    <Button onClick={() => void handlePost()} disabled={!body.trim() || posting}>
                      {posting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                          Posting…
                        </>
                      ) : (
                        'Post comment'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </section>
  );
}
