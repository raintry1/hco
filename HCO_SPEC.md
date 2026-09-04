HCO — Phase 1: Project Foundation & Public UI

You are working on the Hackers Colony Official (HCO) blog platform.

Goal

Build the initial production-quality project foundation and the public-facing blog UI.

Do NOT implement the complete backend, authentication, database integration, admin panel, analytics, or comments yet. Those will be implemented in later phases.

The immediate goal is to create a clean, responsive, SEO-friendly public blog interface that can be reviewed visually through the VPS development server.

Locked Technology Stack

Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

Backend

- Node.js
- Express
- TypeScript

Future infrastructure

- Supabase PostgreSQL
- Supabase Auth with Google OAuth
- Supabase Storage
- Vercel for frontend
- Render for backend

Do not replace these technologies with alternatives.

---

Project Structure

Use a clean monorepo-style structure:

hco/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared TypeScript types/utilities where genuinely useful
├── README.md
└── package.json

Use a workspace-based setup if appropriate.

Keep frontend and backend clearly separated.

---

Public Website

Create the following initial routes:

/                   → Home page
/blog/[slug]        → Individual blog page
/categories/[slug]  → Category page
/search             → Search page

Also create basic placeholder routes/components for:

/about
/login
/profile

These do not need full functionality yet.

---

Home Page Design

Follow the previously established HCO visual direction:

- Dark modern interface
- Premium cybersecurity / developer aesthetic
- Neon-purple accent
- Charcoal/black background
- High readability
- Rounded cards
- Subtle borders
- Clean typography
- Avoid excessive visual effects
- Avoid making it look like a generic "hacker" template

The website should feel like a serious technology/cybersecurity publication.

Hero section:

"Learn. Hack. Build. Grow Together."

Include:

- Short supporting description
- Browse Articles CTA
- Join Community CTA
- HCO branding
- Cybersecurity/developer visual element

Then include:

1. Featured article
2. Latest posts
3. Category browser
4. Popular/trending posts
5. Community/newsletter section
6. Footer

Use realistic mock blog data for now.

Do NOT hardcode the UI around one article. Build reusable components.

---

Blog Cards

Create reusable components for blog posts.

Each card should support:

- Cover image
- Category
- Title
- Short description/excerpt
- Author
- Published date
- Reading time
- View count placeholder
- Optional featured/trending indicator

Cards must be responsive.

---

Blog Article Page

Create a polished article-reading experience.

Include:

- Breadcrumbs
- Category
- Title
- Description
- Author
- Published date
- Reading time
- Hero image
- Article content
- Code blocks
- Headings
- Lists
- Quotes
- Images
- Embedded video placeholder
- Related articles
- Share actions
- Comments section placeholder

For now, article content can come from local mock data.

Design the content renderer so it can later be connected to the database without rebuilding the UI.

---

Mobile First

The website must be designed mobile-first.

The primary review device is an Android phone.

Pay particular attention to:

- Navigation
- Touch targets
- Typography
- Article readability
- Image sizing
- Horizontal overflow
- Sticky/fixed elements
- Bottom spacing
- Card density

The desktop layout should still be responsive and polished.

---

Components

Create reusable components rather than duplicating markup.

Examples:

components/
├── layout/
├── navigation/
├── blog/
├── cards/
├── buttons/
├── typography/
├── footer/
└── ui/

Use shadcn/ui where it provides genuine value.

Do not install unnecessary component libraries.

---

Data Layer

For Phase 1, use typed local mock data.

Create proper TypeScript types for:

- Post
- Author
- Category
- Tag

Do not scatter mock objects throughout components.

Keep mock data in a dedicated location so it can later be replaced by API calls.

---

SEO

Since this is a blog platform, SEO is important from the beginning.

Implement:

- Proper page metadata
- Dynamic metadata for blog pages
- Semantic HTML
- Correct heading hierarchy
- Open Graph metadata where appropriate
- Canonical URL structure
- SEO-friendly slugs
- robots.txt
- sitemap foundation

Do not use fake SEO tricks or keyword stuffing.

---

Accessibility

Follow basic accessibility standards:

- Semantic HTML
- Keyboard-accessible controls
- Proper labels
- Alt text
- Sufficient contrast
- Visible focus states
- Buttons should be actual buttons
- Links should be actual links

---

Performance

Keep the initial implementation lightweight.

Avoid:

- Huge dependencies
- Unnecessary client components
- Excessive JavaScript
- Autoplaying heavy media
- Unnecessary animations

Prefer server components where appropriate.

Use optimized Next.js image handling.

---

Backend

Create the Express application foundation in:

apps/api

It should:

- Start successfully
- Listen on port 4040
- Have a health endpoint:

GET /health

Response:

{
"status": "ok"
}

Do NOT implement database access yet.

Do NOT add Supabase credentials yet.

---

Frontend Development Server

The Next.js application must run on port 3000.

It must be possible to expose it on the VPS using:

npm run dev -- --hostname 0.0.0.0 --port 3000

The API must run on port 4040.

Make sure the development setup works correctly from the VPS.

---

Environment Variables

Create appropriate .env.example files.

Do NOT put real secrets into the repository.

Do NOT invent Supabase credentials.

---

Git Safety

Before making changes:

1. Inspect the existing repository.
2. Preserve the existing README unless it genuinely needs updating.
3. Do not delete existing files unnecessarily.
4. Do not overwrite working code without understanding it.

After implementation:

1. Run type checking.
2. Run linting.
3. Run the production build for the frontend.
4. Verify the Express server.
5. Fix any errors found.

Do not claim completion if the build fails.

---

Important Rules

Do NOT:

- Add authentication yet
- Add Supabase yet
- Add real analytics yet
- Add admin functionality yet
- Add comments functionality yet
- Add payment systems
- Add unnecessary packages
- Add Docker unless genuinely required
- Add Redis
- Add MongoDB
- Replace Next.js
- Replace Express
- Replace Supabase
- Invent a different architecture

Do not over-engineer.

Build only Phase 1.

At the end, provide:

1. Files created/changed
2. Commands to run frontend
3. Commands to run backend
4. Any environment variables required
5. Validation/build results
6. Any issues that remain
