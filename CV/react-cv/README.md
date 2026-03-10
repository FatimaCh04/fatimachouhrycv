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
2. **Root Directory:** leave empty (do not set "CV").
3. **Environment Variables** (Vercel Dashboard → Settings):
   - `VITE_SUPABASE_URL` – your Supabase project URL  
   - `VITE_SUPABASE_ANON_KEY` – your Supabase anon key  
   - (Optional) `GMAIL_USER` + `GMAIL_APP_PASSWORD` – for Contact form email to Gmail

See **VERCEL_DEPLOY.md** if you get 404. See **CONTACT_EMAIL_SETUP.md** for Gmail setup.

## Profile photo

Put your photo at `public/assets/images/profile.jpg`. If missing, the placeholder is shown.
