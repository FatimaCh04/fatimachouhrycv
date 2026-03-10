# Fix 404 on Vercel

If you see **"Congratulations!"** but then **404: NOT FOUND** when you open the site, Vercel is building from the wrong folder. Fix the **Root Directory** and redeploy.

## Step 1: Set Root Directory

1. Open [Vercel Dashboard](https://vercel.com) → your project → **Settings** → **General**.
2. Find **Root Directory**.
3. Set it to the folder that contains **this app’s** `package.json`:
   - **If your GitHub repo only contains this app** (repo root = this `react-cv` folder): leave Root Directory **empty** or `.`
   - **If your repo has this app inside a subfolder** (e.g. `CV/react-cv`): set Root Directory to **`CV/react-cv`** (no leading slash).

   So Vercel runs `npm install` and `npm run build` inside that folder and finds `dist/` and `index.html`.

4. Click **Save**.

## Step 2: Build settings (should already be correct)

- **Framework Preset:** Vite (or “Other”)
- **Build Command:** `npm run build` (from `vercel.json`)
- **Output Directory:** `dist` (from `vercel.json`)

No need to change these if they’re already set.

## Step 3: Redeploy

- Go to **Deployments** → open the latest deployment → **⋯** (three dots) → **Redeploy**.
- Wait for the build to finish, then open your site again.

After this, the 404 should be gone and the site should load.
