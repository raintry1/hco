Create a root-level file named AGENTS.md for this repository.

IMPORTANT:
Do NOT modify, refactor, or delete any existing application code.
Do NOT add any new functionality.
Your only task is to document the current project state.

First inspect the entire repository carefully, including:
- root package.json
- apps/web
- apps/api
- packages/shared
- all existing routes/pages
- components
- configuration files
- TypeScript types
- mock data
- scripts
- environment example files

Then create:

/home/ubuntu/hco/AGENTS.md

The purpose of AGENTS.md is to serve as a complete handoff/context document for another coding agent (Freebuff) that will continue development of this project.

Document the ACTUAL current implementation, not what you think the project should contain.

Include these sections:

# HCO — Agent Context

## 1. Project Overview
Explain what HCO (Hackers Colony Official) is and what this application is intended to become.

## 2. Current Project Status
Clearly state that Phase 1 is complete and that the current application is still using mock blog data.

Explain what is currently implemented and what is intentionally NOT implemented yet.

## 3. Tech Stack
Document the exact technologies currently present in the repository, including:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Express
- Node.js
- shared TypeScript package
- any icon/library dependencies actually installed

Do not invent dependencies. Verify package.json files.

## 4. Repository Structure
Document the current directory structure and explain the purpose of important directories/files.

Example:

hco/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
└── ...

Use the ACTUAL structure from the repository.

## 5. Frontend
Document:
- Next.js App Router usage
- current routes/pages
- layouts
- reusable components
- navigation
- blog components
- category components
- search
- login page
- profile page
- SEO-related implementation
- responsive/mobile behavior

Explain important implementation details another agent needs to know before modifying the frontend.

## 6. Backend
Document:
- Express setup
- entry point
- current port
- available endpoints
- current /health endpoint
- current state of backend functionality

Clearly state that the backend is currently minimal and does not yet contain Supabase/auth/post/comment APIs.

## 7. Shared Package
Document what exists in packages/shared and what types/interfaces are currently defined.

## 8. Mock Data
Document:
- where mock data is stored
- what kinds of data currently exist
- how the frontend currently consumes it
- that this will eventually be replaced/connected to the database

## 9. Current UI / Design Direction
Document the current HCO visual direction:
- dark cybersecurity aesthetic
- purple accent
- mobile-first responsive design
- typography direction
- navigation behavior
- category icons use Lucide icons instead of emojis
- trending ranking badges were made compact
- mobile menu overlay behavior was fixed

Mention any important UI decisions that should not be casually reverted.

## 10. Current Commands
Document the actual commands available from package.json for:
- development
- frontend development
- backend development
- build
- typecheck
- lint
- any other useful project commands

Verify these commands from the repository instead of guessing.

## 11. Environment Variables
Document the environment example files and explain what each variable is for.

Do NOT include any real secrets, API keys, tokens, passwords, or credentials.

## 12. Completed Phase 1
Give a concise checklist of what Phase 1 accomplished.

## 13. Deferred / Not Implemented
Clearly list functionality that has intentionally NOT been implemented yet, including:
- Supabase integration
- Google OAuth
- real user authentication/session management
- real posts database
- comments
- admin authentication/authorization
- admin panel
- post creation/editing/deleting/publishing
- image/media storage
- analytics
- production deployment configuration

Only list things that are actually not implemented.

## 14. Planned Next Development
Document the intended next phase based on the current project direction:

Phase 2 should begin with the Supabase foundation and authentication/database architecture.

The intended permission model is:

Visitor:
- read posts
- browse/search
- view categories
- login with Google

Authenticated user:
- everything above
- comment on posts
- cannot create posts

Admin:
- create posts
- edit posts
- delete posts
- publish/unpublish posts
- manage content
- access analytics

Mention that authorization must be enforced server-side/database-side, not merely by hiding frontend UI.

## 15. Important Development Rules
Add rules for future agents:
- Preserve the existing architecture unless there is a concrete reason to change it.
- Do not rewrite working components unnecessarily.
- Do not replace Next.js/Express with another framework.
- Do not introduce speculative dependencies.
- Do not implement future phases prematurely.
- Inspect existing code before changing it.
- Keep mobile responsiveness intact.
- Run typecheck, lint, and production build after significant changes.
- Never expose secrets.
- Prefer small, focused changes.
- Do not remove existing functionality while implementing new functionality.

## 16. Agent Handoff Notes
Write practical notes that would help a new coding agent immediately understand:
- where to start
- what is already working
- what should NOT be touched
- what the next logical implementation step is

IMPORTANT:
This file must describe the repository AS IT EXISTS RIGHT NOW.
Do not fabricate features, APIs, database tables, environment variables, routes, or dependencies.

After creating AGENTS.md:
1. Read the file once.
2. Verify it is accurate against the repository.
3. Run git diff -- AGENTS.md.
4. Do not modify any other files.

Finally report:
- AGENTS.md created
- files inspected
- confirmation that no application code was changed.
