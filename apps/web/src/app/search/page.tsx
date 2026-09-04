'use client';

import Link from 'next/link';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { searchPosts, posts } from '@/data/mock-data';
import { BlogCard, CompactPostCard } from '@/components/cards/blog-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/lib/site-config';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof posts>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const performSearch = useCallback((q: string) => {
    setIsSearching(true);
    setTimeout(() => {
      let searchResults = searchPosts(q);
      
      if (selectedCategory) {
        searchResults = searchResults.filter(p => p.category.slug === selectedCategory);
      }
      if (selectedTag) {
        searchResults = searchResults.filter(p => p.tagIds.includes(selectedTag));
      }
      
      setResults(searchResults);
      setIsSearching(false);
    }, 150);
  }, [selectedCategory, selectedTag]);

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags.map(t => t.name))));
  const allCategories = Array.from(new Set(posts.map(p => p.category.name)));

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <header className="border-b bg-card">
        <div className="container-narrow py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Search</h1>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                id="search-input"
                placeholder="Search articles, authors, topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-12 py-3 text-lg"
                autoFocus
                aria-label="Search articles"
                autoComplete="off"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              )}
            </div>

            {query && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-1 ml-auto"
                >
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Filters
                </Button>
              </div>
            )}

            {/* Filters */}
            {showFilters && query && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Category:</span>
                      <select
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        className="px-3 py-1.5 border rounded-md bg-background text-sm"
                        aria-label="Filter by category"
                      >
                        <option value="">All Categories</option>
                        {allCategories.map(cat => (
                          <option key={cat} value={cat.toLowerCase().replace(/\s+/g, '-')}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Tag:</span>
                      <select
                        value={selectedTag || ''}
                        onChange={(e) => setSelectedTag(e.target.value || null)}
                        className="px-3 py-1.5 border rounded-md bg-background text-sm"
                        aria-label="Filter by tag"
                      >
                        <option value="">All Tags</option>
                        {allTags.slice(0, 20).map(tag => (
                          <option key={tag} value={tag.toLowerCase().replace(/\s+/g, '-')}>{tag}</option>
                        ))}
                      </select>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedCategory(null); setSelectedTag(null); }}>
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </header>

      {/* Search Results */}
      <div className="container-narrow py-12">
        {isSearching ? (
          <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <span className="sr-only">Searching...</span>
          </div>
        ) : query === '' ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" aria-hidden="true" />
            <h2 className="text-xl font-semibold mb-2">Search articles, authors, and topics</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Find the latest security research, tutorials, and career advice from the HCO community.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {['XSS', 'Zero-Knowledge', 'Malware', 'Kubernetes', 'Rust', 'Bug Bounty'].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(tag)}
                  className="gap-1"
                >
                  {tag}
                </Button>
              ))}
            </div>

            {/* Popular Categories */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Popular Categories</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: 'Web Security', slug: 'web-security', count: 12 },
                  { name: 'Cryptography', slug: 'cryptography', count: 6 },
                  { name: 'Malware Analysis', slug: 'malware-analysis', count: 7 },
                  { name: 'DevOps Security', slug: 'devops-security', count: 4 },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="p-4 border rounded-lg hover:border-primary/50 transition-colors text-left"
                  >
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">{cat.count} articles</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <svg className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t find any articles matching &ldquo;{query}&rdquo;.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="outline" onClick={() => setQuery('')}>
                Clear search
              </Button>
              <Button variant="outline" onClick={() => setQuery(query.split(' ')[0])}>
                Try: {query.split(' ')[0]}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {results.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Related Searches */}
            <Separator className="mb-8" />
            <h2 className="text-xl font-semibold mb-4">Related Searches</h2>
            <div className="flex flex-wrap gap-2">
              {['security', 'vulnerability', 'tutorial', 'career', 'tools', 'CTF'].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}