# CV Portfolio — Next.js + Supabase

This is the Next.js + Supabase version of the Fatima Choudhry CV/portfolio.

## Setup

1. **Clone and install**
   ```bash
   cd cv-next
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL Editor, run the contents of `supabase/schema.sql` to create tables and RLS policies.

3. **Environment**
   - Copy `.env.local.example` to `.env.local`.
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project (Settings → API).
   - Contact form messages are saved in Supabase table `contact_messages` (no Formspree needed). Run the full `supabase/schema.sql` to create this table.

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Pages

- **Public:** Home, About, Services, Portfolio, Blog, Resume, Contact.
- **Portfolio:** `/portfolio` lists projects; `/portfolio/[id]` shows project detail.
- **Blog:** `/blog` lists posts; `/blog/[id]` shows post detail.
- **Admin:** `/admin/login` (auth and CRUD to be added).

## Data

- Profile, projects, services, and posts are stored in Supabase.
- Without env vars, the app still runs; profile and lists fall back to empty/defaults.
- Add a profile row with `id = 1` and manage projects/services/posts via Supabase or the future admin UI.

## Assets

- Put profile image at `public/assets/images/profile.jpg` (or set `photo` URL in Supabase).
- Project images can be paths under `public/` or full URLs (e.g. Supabase Storage).

---

## Vercel par Live Deploy

1. **Code GitHub par push karein**
   - Agar abhi repo nahi hai: `cv-next` folder ko ek new GitHub repo se connect karein.
   ```bash
   cd cv-next
   git init
   git add .
   git commit -m "Portfolio Next.js + Supabase"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Vercel par project banaen**
   - [vercel.com](https://vercel.com) par jayein, **Sign Up** / **Log In** (GitHub se login best).
   - **Add New… → Project**.
   - GitHub repo **cv-next** select karein (ya jo naam hai).
   - **Framework Preset:** Next.js (auto detect ho jata hai).
   - **Root Directory:** `cv-next` agar poora repo ke andar ye folder hai; warna blank.

3. **Environment Variables add karein**
   - Vercel project open karein → **Settings → Environment Variables**.
   - Ye do add karein (Production, Preview dono ke liye):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Apna Supabase project URL (Settings → API) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Apna Supabase anon/public key |

   - **Save** karein.

4. **Deploy**
   - **Deploy** button dabayein (ya push pe auto deploy ho jayega).
   - Deploy complete hone ke baad aapko link milega: `https://your-project.vercel.app`.

5. **Supabase + Vercel**
   - Supabase mein `schema.sql` pehle hi run kar chuke hon.
   - Local ya Vercel dono same Supabase project use karenge, isliye data same rahega.

**Note:** Profile photo / project images ke liye agar URL Supabase Storage use karte hain to woh Vercel par bhi kaam karenge. Agar abhi `public/assets/images/` use kar rahe hain to woh bhi deploy ke sath chal jayega.
