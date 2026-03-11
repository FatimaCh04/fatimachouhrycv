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

## Supabase tables (Admin: Services & Contact links)

The admin can manage **Services** and **Contact page links** in the dashboard. Ensure these tables exist in your Supabase project:

- **services** – `id` (uuid, PK), `title`, `description`, `price`, `icon` (and any timestamps your project uses).
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

Then in Admin go to **Contact links** to add Email, GitHub, LinkedIn, etc. The Contact page shows these; if the table is empty, it falls back to default links.

## Profile photo

Put your photo at `public/assets/images/profile.jpg`. If missing, the placeholder is shown.
