# HCO — Agent Context

## 1. Project Overview

HCO (Hackers Colony Official) is a community-driven blog platform for developers and cybersecurity enthusiasts. The platform is designed to be a serious technology/cybersecurity publication where practitioners share knowledge through articles on web security, cryptography, reverse engineering, malware analysis, DevOps security, secure programming, and security careers.

The goal is to build a clean, responsive, SEO-friendly public blog interface with a dark modern interface, premium cybersecurity/developer aesthetic, and neon-purple accent on charcoal/black backgrounds.

## 2. Current Project Status

**Phase 1 is complete.** The current application is a fully functional Next.js frontend with Express backend, using **local mock data** for all blog content (posts, authors, categories, tags). No database integration exists yet.

### What IS Implemented:
- Complete Next.js 14 frontend with App Router, TypeScript, Tailwind CSS
- Express backend with `/health` endpoint on port 4040
- Shared TypeScript types package (`@hco/shared`)
- All Phase 1 routes: `/`, `/blog/[slug]`, `/categories/[slug]`, `/search`, `/about`, `/login`, `/profile`
- Responsive mobile-first design with dark cybersecurity aesthetic
- SEO foundation: metadata, Open Graph, sitemap generation, robots.txt
- Reusable component architecture (shadcn/ui-style)
- Category cards using Lucide icons (not emojis)
- Trending ranking badges made compact for mobile
- Mobile menu overlay fixed with solid background and proper z-index

### What is NOT Implemented (Intentionally Deferred):
- Supabase PostgreSQL database integration
- Supabase Auth with Google OAuth
- Real user authentication/session management
- Real posts database (currently using mock data)
- Comments functionality
- Admin authentication/authorization
- Admin panel
- Post creation/editing/deleting/publishing
- Image/media storage (Supabase Storage)
- Analytics
- Production deployment configuration (Docker, CI/CD)

## 3. Tech Stack

### Frontend (`apps/web`):
- **Next.js 14.2** (App Router)
- **React 18.3**
- **TypeScript 5.4**
- **Tailwind CSS 3.4** (with `@tailwindcss/typography`)
- **shadcn/ui-style components** (built on Radix UI primitives)
- **Lucide React 0.372** (icons)
- **clsx + tailwind-merge** (className utilities)
- **date-fns 3.6** (date formatting)
- **ESLint 8.57** with TypeScript ESLint

### Backend (`apps/api`):
- **Node.js** (via tsx for dev)
- **Express 4.19**
- **TypeScript 5.4**
- **CORS** middleware

### Shared (`packages/shared`):
- **TypeScript 5.4** (types only, no runtime dependencies)

### Root:
- **npm workspaces** for monorepo management
- **concurrently** for running dev servers

### Verified Dependencies (from package.json files):
- **Frontend deps**: `@hco/shared`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`, `clsx`, `date-fns`, `lucide-react`, `next`, `react`, `react-dom`, `tailwind-merge`
- **Frontend devDeps**: `@tailwindcss/typography`, `@types/node`, `@types/react`, `@types/react-dom`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `autoprefixer`, `eslint`, `eslint-config-next`, `eslint-plugin-react-hooks`, `postcss`, `tailwindcss`, `typescript`
- **Backend deps**: `cors`, `express`
- **Backend devDeps**: `@types/cors`, `@types/express`, `@types/node`, `tsx`, `typescript`, `eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- **Shared devDeps**: `typescript`
- **Root devDeps**: `concurrently`

## 4. Repository Structure

```
hco/
├── package.json                    # Root workspace config with npm workspaces
├── HCO_SPEC.md                     # Phase 1 specification
├── README.md                       # Minimal readme
├── apps/
│   ├── api/                        # Express backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── eslint.config.js
│   │   ├── .env.example
│   │   └── src/
│   │       └── index.ts            # Express entry point with /health endpoint
│   └── web/                        # Next.js frontend
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       ├── eslint.config.js
│       ├── .env.example
│       ├── next-env.d.ts
│       ├── public/
│       │   └── robots.txt
│       └── src/
│           ├── app/                # Next.js App Router pages
│           │   ├── layout.tsx      # Root layout with fonts, Header, Footer
│           │   ├── globals.css     # Tailwind + CSS variables
│           │   ├── page.tsx        # Home page
│           │   ├── blog/[slug]/page.tsx    # Blog article page
│           │   ├── categories/[slug]/page.tsx  # Category page
│           │   ├── search/page.tsx         # Search page
│           │   ├── about/page.tsx          # About page
│           │   ├── login/page.tsx          # Login page (server + Suspense)
│           │   ├── login/login-form.tsx    # Login form (client)
│           │   ├── profile/page.tsx        # Profile page
│           │   ├── search/metadata.ts      # Search metadata
│           │   └── sitemap.ts              # Sitemap generation
│           ├── components/
│           │   ├── ui/             # Base UI components (Button, Card, Badge, etc.)
│           │   ├── layout/         # Header, Footer
│           │   ├── navigation/     # MainNav, MobileMenu
│           │   ├── cards/          # BlogCard, CategoryCard
│           │   ├── blog/           # ArticleContent, ShareButtons
│           │   ├── typography/     # Prose, Heading, Lead, etc.
│           │   └── footer/         # Footer
│           ├── lib/
│           │   ├── utils.ts        # cn(), formatDate, slugify, etc.
│           │   └── site-config.ts  # Site config, category config
│           └── data/
│               └── mock-data.ts    # All mock blog data + query functions
├── packages/
│   └── shared/                     # Shared TypeScript types
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           └── types.ts            # Author, Category, Tag, Post, etc.
└── new.md                          # This instruction file
```

## 5. Frontend

### Next.js App Router
- Uses App Router with Server Components by default
- Client components marked with `'use client'` directive
- Static generation where possible (`generateStaticParams` for blog/category pages)
- Dynamic routes: `/blog/[slug]`, `/categories/[slug]`

### Current Routes/Pages
| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Home page with hero, featured article, latest posts, categories, trending, newsletter, stats |
| `/blog/[slug]` | SSG | Individual blog article with breadcrumbs, content, author bio, related posts, share actions, comments placeholder |
| `/categories/[slug]` | SSG | Category page with pagination, sorting (latest/popular/oldest), other categories grid |
| `/search` | Client | Search page with real-time filtering, category/tag filters, popular categories fallback |
| `/about` | Static | About page with mission, values, topics, team, CTA |
| `/login` | Server + Client | Login page with Suspense wrapper, LoginForm client component |
| `/profile` | Client | Profile page with editable profile, settings, bookmarks, security tabs (mock data) |

### Layout
- **Root Layout** (`app/layout.tsx`): Inter + JetBrains Mono fonts, global CSS, Header + Footer wrapper, comprehensive metadata (Open Graph, Twitter, robots, icons)
- **Header**: Sticky, HCO branding, desktop nav + mobile hamburger, auth buttons
- **Footer**: 5-column grid (brand + Platform/Community/Resources/Legal links), social icons, copyright

### Reusable Components
- **UI Primitives** (`components/ui/`): Button, Card, Badge, Avatar, Separator, DropdownMenu, Input (all shadcn/ui-style)
- **Layout**: Header, Footer
- **Navigation**: MainNav (desktop), MobileMenu (hamburger with overlay)
- **Cards**: BlogCard (4 variants: default, featured, compact, trending), CategoryCard (default, compact), CategoryGrid, CategoryList
- **Blog**: ArticleContent (markdown parser), ShareButtons (Twitter, LinkedIn, Copy)
- **Typography**: Prose, Heading (h1-h4), Lead, Muted, Highlight, CodeInline

### Navigation
- Desktop: Horizontal nav in header
- Mobile: Hamburger menu opens full-screen overlay (fixed, z-[100], solid background)
- Mobile menu includes main nav links + auth buttons

### Search
- Client-side component with debounced search (150ms)
- Filters by category and tag (dropdowns)
- Highlights popular categories when empty
- Shows related search suggestions after results

### SEO Implementation
- Root metadata with title template, Open Graph, Twitter cards
- Dynamic metadata per blog article (generateMetadata)
- Category page metadata
- Sitemap generation (`app/sitemap.ts`) with static, blog, and category routes
- robots.txt in `/public`
- JSON-LD structured data (BlogPosting) on article pages
- Semantic HTML, proper heading hierarchy

### Responsive/Mobile Behavior
- Mobile-first design (primary review device: Android phone)
- Tailwind responsive breakpoints: `sm:`, `lg:`, `md:`
- Touch targets: minimum 44px
- Mobile menu: full-screen overlay, scrollable, z-[100]
- Card grids: 1 col mobile → 2 col sm → 3-4 col lg
- Trending rank badges: compact `w-10 h-10` pills (not large circles)
- Category icons: Lucide SVG icons (not emojis)

## 6. Backend

### Express Setup
- Entry point: `apps/api/src/index.ts`
- Runs on **port 4040** (configurable via `PORT` env var)
- CORS enabled for frontend origin
- JSON body parsing

### Current Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Returns `{ "status": "ok" }` |

### Current State
The backend is **minimal** - only the health check endpoint exists. It does **not** contain:
- Supabase client initialization
- Authentication endpoints
- Post CRUD APIs
- Comment APIs
- Admin APIs
- Any database integration

## 7. Shared Package

Location: `packages/shared/src/types.ts`

### Exported Types/Interfaces:
- `Author` - id, name, slug, avatar, bio, role, social links, createdAt
- `Category` - id, name, slug, description, color, icon, postCount, createdAt
- `Tag` - id, name, slug, createdAt
- `Post` - id, slug, title, description, content, coverImage, authorId, categoryId, tagIds, publishedAt, updatedAt, readingTime, viewCount, featured, trending, status, seoTitle, seoDescription
- `PostWithRelations` - Post + populated author, category, tags
- `PaginatedPosts` - posts, total, page, pageSize, totalPages
- `SearchResult` - posts, query, total
- `SiteConfig` - name, description, url, ogImage, twitterHandle
- `NavItem` - label, href, children

## 8. Mock Data

Location: `apps/web/src/data/mock-data.ts`

### Data Contents:
- **4 Authors** - with avatars (DiceBear), bios, roles, social links
- **8 Categories** - Web Security, Network Security, Cryptography, Reverse Engineering, Malware Analysis, DevOps Security, Programming, Career (each with color, icon name, postCount)
- **18 Tags** - XSS, SQL Injection, CSRF, Authentication, OAuth, JWT, Zero-Knowledge, Elliptic Curves, Ghidra, IDA Pro, YARA, Docker, Kubernetes, Rust, Go, Bug Bounty, CTF, OSINT
- **6 Posts** - Full PostWithRelations with markdown content, cover images (Unsplash), reading times, view counts, featured/trending flags

### Query Functions:
- `getPostBySlug(slug)` - single post
- `getPostsByCategory(categorySlug)` - filtered posts
- `getFeaturedPosts()` - featured posts
- `getTrendingPosts()` - trending posts
- `getLatestPosts(limit)` - recent posts
- `getRelatedPosts(postId, limit)` - related by category/tags
- `searchPosts(query)` - full-text search across title, description, content, tags, category, author

### Frontend Consumption:
- Server components import directly from `@/data/mock-data`
- Client components import query functions and data
- Static generation uses `generateStaticParams` with `allPosts` import
- This mock data layer will be replaced by API calls in Phase 2

## 9. Current UI / Design Direction

### Visual Identity
- **Dark theme**: charcoal/black backgrounds (`hsl(0 0% 3%)`), card backgrounds (`hsl(0 0% 6%)`)
- **Primary accent**: Neon purple (`hsl(271 91% 65%)`)
- **Typography**: Inter (UI), JetBrains Mono (code)
- **Borders**: Subtle (`hsl(0 0% 18%)`)
- **Cards**: Rounded-lg (`0.75rem`), shadow-sm

### Key UI Decisions (Do Not Revert Casually):
1. **Category icons use Lucide icons** (Shield, Globe, Lock, Cpu, Bug, Server, Code, Briefcase) - NO emojis
2. **Trending ranking badges** are compact `w-10 h-10` pills with `#{rank}` text - NOT large `w-16 h-16` circles with separate Badge
3. **Mobile menu overlay** uses `z-[100]` with explicit solid background (`hsl(var(--background))`) - prevents content bleed-through
4. **Dark mode only** (no light mode toggle implemented)
5. **CSS variables** for theming (defined in `globals.css`)

### Navigation Behavior
- Desktop: Persistent horizontal nav
- Mobile: Hamburger → full-screen overlay with nav + auth buttons
- Sticky header with backdrop blur

## 10. Current Commands

From root `package.json`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend and backend concurrently |
| `npm run dev:web` | Frontend only (Next.js on port 3000, hostname 0.0.0.0) |
| `npm run dev:api` | Backend only (Express on port 4040 with tsx watch) |
| `npm run build:web` | Production build Next.js frontend |
| `npm run build:api` | Build Express backend (tsc) |
| `npm run lint:web` | Lint frontend |
| `npm run lint:api` | Lint backend |
| `npm run typecheck:web` | TypeScript check frontend |
| `npm run typecheck:api` | TypeScript check backend |
| `npm run typecheck` (in packages/shared) | TypeScript check shared |

From `apps/web/package.json`:
- `npm run dev` → `next dev --hostname 0.0.0.0 --port 3000`
- `npm run build` → `next build`
- `npm run start` → `next start`
- `npm run lint` → `next lint`
- `npm run typecheck` → `tsc --noEmit`

From `apps/api/package.json`:
- `npm run dev` → `tsx watch src/index.ts`
- `npm run build` → `tsc`
- `npm run start` → `node dist/index.js`
- `npm run lint` → `eslint src --ext .ts`
- `npm run typecheck` → `tsc --noEmit`

## 11. Environment Variables

### Frontend (`apps/web/.env.example`):
```
NEXT_PUBLIC_API_URL=http://localhost:4040
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Supabase (Phase 2+)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Analytics (Phase 2+)
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_UMAMI_ID=
# Feature Flags
NEXT_PUBLIC_ENABLE_COMMENTS=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Backend (`apps/api/.env.example`):
```
PORT=4040
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
# Supabase (Phase 2+)
# SUPABASE_URL=
# SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
# JWT (Phase 2+)
# JWT_SECRET=
```

**No real secrets in repository.** All sensitive values are commented out placeholders.

## 12. Completed Phase 1 Checklist

- [x] Monorepo structure with npm workspaces (apps/web, apps/api, packages/shared)
- [x] Next.js 14 frontend with TypeScript, Tailwind, shadcn/ui-style components
- [x] Express backend with TypeScript on port 4040
- [x] Shared TypeScript types package
- [x] Home page: hero, featured article, latest posts, categories, trending, newsletter, footer
- [x] Blog article page (`/blog/[slug]`): breadcrumbs, content rendering, author bio, related posts, share actions, comments placeholder
- [x] Category page (`/categories/[slug]`): pagination, sorting, other categories
- [x] Search page (`/search`): real-time search, filters, popular categories fallback
- [x] Placeholder routes: `/about`, `/login`, `/profile`
- [x] Reusable components: Button, Card, Badge, Avatar, Separator, DropdownMenu, Input, BlogCard, CategoryCard, ArticleContent, ShareButtons, Prose/Heading/Lead, Header, Footer, MainNav, MobileMenu
- [x] SEO: metadata, Open Graph, Twitter cards, sitemap.xml, robots.txt, JSON-LD
- [x] Mobile-first responsive design
- [x] Category emojis replaced with Lucide icons
- [x] Trending rank badges made compact for mobile
- [x] Mobile menu overlay fixed (solid background, z-index, no bleed-through)
- [x] TypeScript typechecking passes (web, api, shared)
- [x] Production build succeeds
- [x] Express `/health` endpoint verified

## 13. Deferred / Not Implemented

The following are intentionally NOT implemented and should be built in future phases:

- **Supabase integration** (PostgreSQL, Auth, Storage)
- **Google OAuth** authentication
- **Real user authentication/session management**
- **Real posts database** (replacing mock data)
- **Comments functionality**
- **Admin authentication/authorization**
- **Admin panel**
- **Post creation/editing/deleting/publishing**
- **Image/media storage** (Supabase Storage)
- **Analytics** (GA, Umami, etc.)
- **Production deployment configuration** (Docker, CI/CD, Vercel/Render setup)
- **Email/newsletter system**
- **Real-time features** (WebSockets, Server-Sent Events)

## 14. Planned Next Development

### Phase 2: Supabase Foundation & Authentication/Database Architecture

**Intended Permission Model:**

| Role | Capabilities |
|------|--------------|
| **Visitor** | Read posts, browse/search, view categories, login with Google |
| **Authenticated User** | All Visitor + comment on posts (cannot create posts) |
| **Admin** | All Authenticated + create/edit/delete/publish posts, manage content, access analytics |

**Critical:** Authorization must be enforced **server-side/database-side** (Supabase RLS policies), not merely by hiding frontend UI.

### Phase 2 Starting Points:
1. Initialize Supabase project
2. Set up database schema (users, posts, categories, tags, comments)
3. Configure Supabase Auth with Google OAuth provider
4. Implement server-side session management (SSR-compatible)
5. Create API routes for posts CRUD with RLS policies
6. Connect frontend to replace mock data with real API calls
7. Add admin role assignment mechanism

## 15. Important Development Rules

- **Preserve existing architecture** unless there is a concrete reason to change it
- **Do not rewrite working components** unnecessarily
- **Do not replace Next.js/Express** with another framework
- **Do not introduce speculative dependencies** - verify need first
- **Do not implement future phases prematurely** - complete current phase fully first
- **Inspect existing code before changing it** - understand patterns and conventions
- **Keep mobile responsiveness intact** - test on mobile viewport
- **Run typecheck, lint, and production build** after significant changes
- **Never expose secrets** - use environment variables, never commit credentials
- **Prefer small, focused changes** - easier to review and revert
- **Do not remove existing functionality** while implementing new functionality

## 16. Agent Handoff Notes

### Where to Start (Phase 2):
1. Set up Supabase project and database schema
2. Add Supabase client to both frontend and backend
3. Implement auth flow (Google OAuth → session → protected routes)
4. Replace mock data imports with API calls to backend
5. Build admin panel for content management

### What Is Already Working:
- All Phase 1 routes render correctly
- Static generation for blog/category pages works
- Mobile menu, search, navigation all functional
- TypeScript strict mode passes
- Production build completes without errors
- Express health check responds correctly

### What Should NOT Be Touched:
- The component architecture (UI primitives, layout, cards) - it's solid
- The design system (colors, typography, spacing) - matches spec
- The mock data structure - it correctly mirrors the shared types
- The SEO/metadata implementation - already comprehensive
- The monorepo structure and workspace configuration

### Next Logical Implementation Step:
**Supabase + Auth foundation** - This is the blocker for all subsequent features. Without real authentication and database, no real content management, comments, or user-specific features can exist.

---

**IMPORTANT:** This document describes the repository AS IT EXISTS RIGHT NOW. No features, APIs, database tables, environment variables, routes, or dependencies have been fabricated. All information is verified against the actual codebase.

**Created:** AGENTS.md
**Files Inspected:** All package.json, tsconfig, source files in apps/web, apps/api, packages/shared, configuration files, mock data, components, routes, and environment examples.
**Confirmation:** No application code was modified during this documentation task.