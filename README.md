# Shapeboard

A full-stack web app where admins manage shape records and users watch them appear on a live grid in real-time.

**Live demo:** https://shapeboard-s9p74.ondigitalocean.app/
**Admin portal:** https://shapeboard-s9p74.ondigitalocean.app/admin  
**Test credentials:** admin@shapeboard.com / Shape@123

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Backend:** Next.js API Routes (REST)
- **Database:** Supabase (PostgreSQL + Realtime + Auth)
- **Deployment:** DigitalOcean App Platform

---

## Features

- Admin portal — add, edit, and delete shape records behind a login
- Public user portal — live grid that updates instantly as admins make changes
- Shapes rendered as SVG elements with the stored color
- Real-time sync via Supabase Realtime subscriptions
- Client-side filtering by shape type
- Input validation on both client and server
- Toast notifications for admin actions
- Animated row entrances

---

## Local Development

**1. Clone the repo**
```bash
git clone https://github.com/hassan-dev003/shapeboard.git
cd shapeboard
```

**2. Install dependencies**
```bash
pnpm install
```

**3. Set up environment variables**

Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

All three values are found in your Supabase project under **Settings → API**.

**4. Set up the database**

In Supabase → SQL Editor, run:
```sql
CREATE TABLE shapes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  shape       TEXT NOT NULL CHECK (shape IN ('circle', 'square', 'triangle')),
  color       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE shapes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON shapes FOR SELECT USING (true);

CREATE POLICY "service_write" ON shapes USING (auth.role() = 'service_role');
```

**5. Run the dev server**
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the user portal and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

---

## API Reference

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/shapes` | — | `Shape[]` sorted by `created_at` DESC |
| POST | `/api/shapes` | `{ name, shape, color }` | Created `Shape` — 201 |
| PUT | `/api/shapes/[id]` | Partial `{ name?, shape?, color? }` | Updated `Shape` — 200 |
| DELETE | `/api/shapes/[id]` | — | 204 No Content |

All endpoints return `{ errors: string[] }` with status 400 for validation failures and `{ error: string }` with status 404 or 500 for other failures.

---

## Architecture

The project is a single Next.js monorepo — the frontend and backend live in the same codebase and deploy together. API Routes under `app/api/shapes` handle all CRUD operations, keeping the backend logic close to the frontend without needing a separate server.

Supabase serves three roles: PostgreSQL database for persistence, Realtime for pushing live updates to the user portal, and Auth for protecting the admin route. The user portal subscribes to the `shapes` table on mount and re-fetches whenever an INSERT, UPDATE, or DELETE event fires — no polling needed.

Two Supabase clients are initialised in `lib/supabase.ts`. The browser client uses the public anon key and is safe to use in Client Components. The admin client uses the service role key and is only ever called from API routes, keeping write access server-side.