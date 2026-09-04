import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fetchPost, fetchTaxonomy, ApiError } from '@/lib/admin-posts';
import { PostForm } from '../../post-form';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const supabase = createClient();

  let post;
  try {
    post = await fetchPost(supabase, id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const { categories, tags } = await fetchTaxonomy(supabase);

  return (
    <div className="py-12">
      <div className="container-narrow">
        <div className="max-w-4xl mx-auto">
          <PostForm
            mode="edit"
            postId={post.id}
            initial={post}
            categories={categories}
            tags={tags}
          />
        </div>
      </div>
    </div>
  );
}
