Phase 2B — Supabase Database Foundation + Real Profiles

Phase 2A Google authentication is now working correctly in production-like dev:
Google login → Supabase session → /auth/callback → VPS origin → /profile.

Now implement ONLY the database foundation and real user profiles.

IMPORTANT:
- Do not redesign the UI.
- Do not modify the working Google OAuth flow unless absolutely required.
- Do not change Google OAuth provider configuration.
- Do not change Supabase URL Configuration.
- Do not introduce NextAuth, Prisma, Drizzle, PostgreSQL direct drivers, or another auth/database layer.
- Use Supabase client/RLS properly.
- Do not use service-role keys in the browser.
- Do not fake persistence with React state or mock data.
- Do not implement posts, comments, bookmarks, analytics, admin dashboard, or content migration yet.

1. DATABASE SCHEMA

Create a Supabase SQL migration for these tables.

profiles:
- id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
- display_name text
- username text UNIQUE
- avatar_url text
- bio text
- role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
- created_at timestamptz NOT NULL DEFAULT now()
- updated_at timestamptz NOT NULL DEFAULT now()

The profile ID must always correspond to auth.users.id.

2. AUTOMATIC PROFILE CREATION

Create a secure database trigger/function so that when a new auth.users row is created, a corresponding profiles row is automatically created.

Use Google metadata when available:
- display_name from the user's name/full_name metadata
- avatar_url from avatar_url/picture metadata

Do not copy arbitrary untrusted metadata into role.

Every new user must always receive:
role = 'user'

3. RLS

Enable Row Level Security on profiles.

Policies:

SELECT:
- Public users may read only the profile fields that are needed for displaying authors/user identity.
- Do not expose sensitive auth.users data.

UPDATE:
- Authenticated users can update only their own profile.
- They must never be able to change their own role.

Admin:
- Admin users can update profiles as needed, including role.

Do not create a policy that allows normal users to promote themselves to admin.

Use auth.uid() for ownership checks.

4. PROFILE PAGE

Keep the existing profile page design.

Replace any remaining mock-profile assumptions with the real profiles row.

The page should combine:
- Supabase auth user
- profiles table row

Display:
- display_name
- email from auth user
- avatar_url
- bio
- role where appropriate
- created_at / member-since

If a profile row does not exist for an already-existing user, handle it gracefully instead of crashing.

5. PROFILE EDITING

Make the existing Profile Information section actually persistent.

Authenticated user should be able to edit:
- display_name
- username
- bio
- avatar_url if the current UI supports it

Save changes to profiles using the Supabase client with RLS enforcing ownership.

Do NOT allow the browser to update:
- id
- role
- created_at

Show proper loading, success and error states.

6. AUTH USER VS PROFILE DATA

Keep responsibilities clear:

Supabase Auth:
- id
- email
- Google identity/provider
- authentication/session

profiles:
- display_name
- username
- avatar_url
- bio
- role
- profile timestamps

Do not duplicate the user's password or authentication credentials.

7. TYPES

Update shared TypeScript types if necessary so the Profile type matches the database.

Avoid unnecessary type changes.

8. SEEDING

Do NOT migrate the existing mock posts/categories/tags yet.

Only create the profiles foundation.

9. VALIDATION

After implementation run:

npm run typecheck:web
npm run typecheck:api
npm run build:web
npm run build:api

Also verify:
- existing Google login still works
- existing authenticated session still reaches /profile
- profile data is read from Supabase
- editing display_name/bio persists after refresh
- normal user cannot change role
- new Google users automatically get a profiles row

Before making changes, inspect the existing Supabase client/server setup and current profile implementation.

Use the smallest justified implementation.

At the end report:
1. files created/modified
2. SQL migration/schema created
3. RLS policies
4. profile flow
5. validation results
6. any remaining limitation

Do not proceed to posts/comments/content migration in this task.
