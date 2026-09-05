import type { Metadata } from 'next';
import { getCategories } from '@/lib/api';
import { CategoryCard } from '@/components/cards/category-card';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Categories',
  description: `Browse every article category on ${siteConfig.name} — web security, cryptography, reverse engineering, malware analysis, and more.`,
  openGraph: {
    title: `Categories | ${siteConfig.name}`,
    description: 'Browse every article category — web security, cryptography, reverse engineering, malware analysis, and more.',
    type: 'website',
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  // Taxonomy unreachable (live mode, API down) — degrade with a friendly
  // state instead of an empty-looking page. 200, not an error.
  if (categories === null) {
    return (
      <div className="min-h-screen">
        <div className="container-narrow py-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Categories unavailable</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn&apos;t load the categories right now. Please try again in
            a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="border-b bg-card">
        <div className="container-narrow py-12 lg:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Browse Categories</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore every topic the HCO community writes about — from web
            security and cryptography to careers in cybersecurity.
          </p>
        </div>
      </header>

      {/* Category grid */}
      <div className="container-narrow py-12 lg:py-16">
        {categories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">No categories found</h2>
            <p className="text-muted-foreground">
              Categories will appear here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
