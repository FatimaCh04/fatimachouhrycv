# Fatima Choudhry – Portfolio / CV

React + Vite portfolio with Supabase, Blog, Contact form, and Vercel deploy.

## Run locally

```bash
npm install
cp .env.example .env
# Edit .env: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Deploy (Vercel)

1. Push to GitHub → Import project in Vercel.
2. **Root Directory:** set to the folder that contains `package.json` (e.g. leave empty if repo root is the app, or `CV/react-cv` if the app is in that subfolder).
3. **Environment Variables** (Vercel → Project → Settings → Environment Variables). Add for **Production** (and Preview if you want):
   - `VITE_SUPABASE_URL` – your Supabase project URL (required for Portfolio, Blog, Admin)
   - `VITE_SUPABASE_ANON_KEY` – your Supabase anon key  
   - (Optional) `GMAIL_USER` + `GMAIL_APP_PASSWORD` – for Contact form email to Gmail

   **Important:** `VITE_*` variables are baked in at **build time**. After changing them, trigger a new deploy (Redeploy).

4. Deploy. The project uses `vercel.json` for build command, output directory, SPA rewrites, and cache headers. API routes in `/api` (e.g. contact form, fetch-news) run as serverless functions automatically.

See **VERCEL_DEPLOY.md** if you get 404. See **CONTACT_EMAIL_SETUP.md** for Gmail setup.

## Supabase tables (Admin: Profile, Services, Contact links)

The admin can manage **Profile** (name, title, tagline, photo), **Services**, and **Contact page links**. Ensure these tables exist in your Supabase project:

- **profile** – single row for site profile (name, title, tagline, photo). Run in Supabase SQL Editor:

```sql
create table if not exists profile (
  id integer primary key default 1,
  name text,
  title text,
  tagline text,
  photo text
);
insert into profile (id, name, title, tagline, photo) values (1, 'Fatima Choudhry', 'Software Engineer | Full Stack & Cross-Platform Developer', 'Building scalable automation and custom software solutions.', null)
on conflict (id) do nothing;
```

- **services** – `id` (uuid, PK), `title`, `description`, `price`, `icon`.
- **contact_links** – run in Supabase SQL Editor:

```sql
create table if not exists contact_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon text default 'link',
  sort_order int default 0
);
```

When you change the **profile picture** (or name/title/tagline) in Admin → Profile, it is saved to Supabase and the **live site** (sidebar, Home, About, Resume) shows it. If the `profile` table is empty, the site uses default name and `public/assets/images/profile.jpg`.

## Profile photo (fallback)

Put your default photo at `public/assets/images/profile.jpg`. If the Admin has not saved a profile in Supabase, this image is used.
