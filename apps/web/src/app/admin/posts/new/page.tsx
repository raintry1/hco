import { createClient } from '@/lib/supabase/server';
import { fetchTaxonomy } from '@/lib/admin-posts';
import { PostForm } from '../post-form';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const supabase = createClient();
  const { categories, tags } = await fetchTaxonomy(supabase);

  return (
    <div className="py-12">
      <div className="container-narrow">
        <div className="max-w-4xl mx-auto">
          <PostForm mode="create" categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  );
}
