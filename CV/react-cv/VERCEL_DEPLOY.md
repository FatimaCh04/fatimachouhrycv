# Vercel par 404 fix

Agar deploy ke baad **404: NOT_FOUND** aaye to ye check karein:

## 1. Root Directory sahi karein

- Vercel → apna project → **Settings** → **General**
- **Root Directory** mein **kuch mat likhein** (empty chhor dein) ya sirf `.` likhein
- Agar wahan **CV** ya koi folder name hai to **hata dein** — is project ka app repo ke **root** par hai, kisi subfolder mein nahi

## 2. Build settings (usually theek rehte hain)

- **Framework Preset:** Vite (ya Other)
- **Build Command:** `npm run build` (vercel.json se aa jata hai)
- **Output Directory:** `dist` (vercel.json se aa jata hai)

## 3. Save & Redeploy

- **Save** karein, phir **Deployments** → latest deployment → **Redeploy**

Isse 404 hat jana chahiye aur site chalni chahiye.
