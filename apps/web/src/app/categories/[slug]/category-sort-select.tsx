'use client';

/**
 * Sort dropdown for the category page. Lives in its own client component
 * because a Server Component cannot pass onChange handlers to DOM elements.
 * Preserves the original behavior: navigating sort options triggers a full
 * server round-trip via the URL query string.
 */
export function CategorySortSelect({ sort }: { sort: string }) {
  return (
    <select
      id="sort"
      value={sort}
      onChange={(e) => {
        window.location.search = `?sort=${e.target.value}`;
      }}
      className="px-3 py-2 border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="latest">Latest First</option>
      <option value="popular">Most Popular</option>
      <option value="oldest">Oldest First</option>
    </select>
  );
}
