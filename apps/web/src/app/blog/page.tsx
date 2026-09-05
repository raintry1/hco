import { Metadata } from 'next';
import { getPosts } from '@/lib/api';
import { BlogCardGrid } from '@/components/cards/blog-card';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Read the latest articles on ${siteConfig.name} — web security, cryptography, reverse engineering, malware analysis, and more.`,
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      'Read the latest articles — web security, cryptography, reverse engineering, malware analysis, and more.',
    type: 'website',
  },
};

export default async function BlogPage() {
  // The gateway returns published posts only (live API) or the mock posts
  // (mock mode); the filter keeps both modes honest.
  const posts = (await getPosts()).filter((p) => p.status === 'published');

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="border-b bg-card">
        <div className="container-narrow py-12 lg:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">The Blog</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Latest articles from the HCO community on security, hacking, and
            the craft of building secure software.
          </p>
        </div>
      </header>

      {/* Posts grid */}
      <div className="container-narrow py-12 lg:py-16">
        {posts.length > 0 ? (
          <BlogCardGrid posts={posts} />
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">No articles yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Articles will appear here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}