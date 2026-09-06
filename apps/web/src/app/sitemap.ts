import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { getPosts, getCategories } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const categories = (await getCategories()) ?? [];
  const baseUrl = siteConfig.url;
  const staticRoutes = [
    '',
    '/blog',
    '/categories',
    '/search',
    '/about',
    '/login',
    '/profile',
    '/newsletter',
    '/privacy',
    '/terms',
    '/cookies',
    '/security',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const blogRoutes = posts
    .filter((post) => post.status === 'published')
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes];
}