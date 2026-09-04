export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  role?: string;
  twitter?: string;
  github?: string;
  website?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  postCount?: number;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage?: string;
  authorId: string;
  categoryId: string;
  tagIds: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  viewCount: number;
  featured: boolean;
  trending: boolean;
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
}

export interface PostWithRelations extends Post {
  author: Author;
  category: Category;
  tags: Tag[];
}

export interface PaginatedPosts {
  posts: PostWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchResult {
  posts: PostWithRelations[];
  query: string;
  total: number;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  twitterHandle: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}