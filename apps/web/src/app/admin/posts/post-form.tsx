'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { AdminPost } from '@/lib/admin-posts';
import { slugify, calculateReadingTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Notice = { kind: 'success' | 'error'; text: string } | null;

interface PostFormProps {
  mode: 'create' | 'edit';
  postId?: string;
  initial?: AdminPost;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

export function PostForm({ mode, postId, initial, categories, tags }: PostFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '');
  const [tagIds, setTagIds] = useState<string[]>(initial?.tagIds ?? []);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [trending, setTrending] = useState(initial?.trending ?? false);
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? '');
  const [status, setStatus] = useState<'draft' | 'published'>(
    initial?.status ?? 'draft'
  );
  const [readingTimeInput, setReadingTimeInput] = useState(
    initial?.readingTime ? String(initial.readingTime) : ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  // Guards against a second submit firing before the disabled button re-renders
  // (double click, Enter + click). The server-side tag replacement is also
  // idempotent, so a racing save can never corrupt tags — this just prevents
  // the duplicate request from being sent in the first place.
  const submittingRef = useRef(false);

  const autoReadingTime = useMemo(() => calculateReadingTime(content), [content]);
  const readingTimeLabel =
    readingTimeInput.trim() === ''
      ? `${autoReadingTime} min (auto)`
      : `${readingTimeInput.trim()} min`;

  const toggleTag = (id: string) => {
    setTagIds((current) =>
      current.includes(id) ? current.filter((t) => t !== id) : [...current, id]
    );
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSaving(true);
    setNotice(null);

    const payload: Record<string, unknown> = {
      title,
      description,
      content,
      categoryId,
      tagIds,
      featured,
      trending,
      status,
    };
    // slug/URL/SEO fields are optional — omit empty strings entirely.
    if (slug.trim()) payload.slug = slug.trim();
    if (coverImageUrl.trim()) payload.coverImageUrl = coverImageUrl.trim();
    if (seoTitle.trim()) payload.seoTitle = seoTitle.trim();
    if (seoDescription.trim()) payload.seoDescription = seoDescription.trim();
    const parsedReadingTime = Number(readingTimeInput);
    if (readingTimeInput.trim() !== '' && Number.isInteger(parsedReadingTime)) {
      payload.readingTime = parsedReadingTime;
    }

    try {
      const endpoint =
        mode === 'edit' ? `/api/admin/posts/${postId}` : '/api/admin/posts';
      const res = await fetch(endpoint, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setNotice({
          kind: 'error',
          text: body?.error ?? 'Could not save the post. Please try again.',
        });
        return;
      }

      setNotice({ kind: 'success', text: 'Post saved.' });
      router.push('/admin/posts');
      router.refresh();
    } catch {
      setNotice({ kind: 'error', text: 'Network error while saving. Please try again.' });
    } finally {
      submittingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">
          {mode === 'edit' ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/posts">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            {isSaving
              ? 'Saving…'
              : status === 'published'
                ? 'Save & Publish'
                : 'Save Draft'}
          </Button>
        </div>
      </div>

      {notice && (
        <div
          className={`flex items-center gap-2 p-3 rounded-md text-sm ${
            notice.kind === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
              : 'bg-destructive/10 border border-destructive/20 text-destructive'
          }`}
          role="alert"
        >
          {notice.kind === 'success' ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          {notice.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Article</CardTitle>
          <CardDescription>Core content shown on the blog.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium mb-1">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              maxLength={200}
              placeholder="e.g. Securing WebSockets in Production"
              required
            />
          </div>

          <div>
            <label htmlFor="post-slug" className="block text-sm font-medium mb-1">
              Slug
            </label>
            <Input
              id="post-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              maxLength={160}
              placeholder="auto-generated from the title"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lowercase letters, numbers and hyphens. Leave empty to auto-generate
              (a unique suffix is added if taken).
            </p>
          </div>

          <div>
            <label htmlFor="post-description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="post-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={600}
              rows={3}
              placeholder="Short excerpt shown on cards and in search results"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            />
          </div>

          <div>
            <label htmlFor="post-content" className="block text-sm font-medium mb-1">
              Content (Markdown) <span className="text-destructive">*</span>
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder={'# Heading\n\nWrite your article in Markdown…'}
              required
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            />
          </div>

          <div>
            <label htmlFor="post-cover" className="block text-sm font-medium mb-1">
              Cover Image URL
            </label>
            <Input
              id="post-cover"
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://… (optional)"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
          <CardDescription>Category and tags for this article.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label htmlFor="post-category" className="block text-sm font-medium mb-1">
              Category <span className="text-destructive">*</span>
            </label>
            <select
              id="post-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>
                Select a category…
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium mb-2">Tags</legend>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const checked = tagIds.includes(tag.id);
                return (
                  <label
                    key={tag.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTag(tag.id)}
                      className="sr-only"
                    />
                    {tag.name}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing &amp; SEO</CardTitle>
          <CardDescription>
            Drafts stay private; publishing sets the publish date. SEO fields are
            optional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="post-status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="post-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Publishing sets published_at; switching back to draft clears it.
              </p>
            </div>
            <div>
              <label htmlFor="post-reading-time" className="block text-sm font-medium mb-1">
                Reading Time (minutes)
              </label>
              <Input
                id="post-reading-time"
                type="number"
                min={1}
                max={999}
                value={readingTimeInput}
                onChange={(e) => setReadingTimeInput(e.target.value)}
                placeholder="auto"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Estimated: <span>{readingTimeLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={trending}
                onChange={(e) => setTrending(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              Trending
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="post-seo-title" className="block text-sm font-medium mb-1">
                SEO Title
              </label>
              <Input
                id="post-seo-title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={200}
                placeholder="Falls back to the article title"
              />
            </div>
            <div>
              <label htmlFor="post-seo-description" className="block text-sm font-medium mb-1">
                SEO Description
              </label>
              <Input
                id="post-seo-description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={300}
                placeholder="Falls back to the description"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
