# Vercel par Portfolio Live karne ke steps

## Option 1: GitHub se deploy (recommended)

1. **GitHub par repo banao**
   - https://github.com/new par jao
   - Repo name: `Portfolio` (ya koi bhi)
   - Create repository

2. **Code push karo** (GitHub Desktop ya terminal):
   ```bash
   cd f:\AWT\Portfolio
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Portfolio.git
   git push -u origin main
   ```

3. **Vercel par project add karo**
   - https://vercel.com par jao (sign up / login with GitHub)
   - **Add New** → **Project**
   - **Import** your GitHub repo (Portfolio)
   - **Framework Preset:** Other (static HTML)
   - **Root Directory:** . (leave default)
   - **Deploy** click karo

4. Deploy ke baad aapko link milega: `https://portfolio-xxx.vercel.app`

---

## Option 2: Vercel CLI se (terminal)

1. **Node.js** installed hona chahiye: https://nodejs.org

2. **Vercel login & deploy:**
   ```bash
   cd f:\AWT\Portfolio
   npx vercel
   ```
   - Pehli bar: login (browser khulega)
   - Project name pooche to Enter dabao
   - Deploy ho jayega, URL terminal mein dikhega

3. **Production deploy** (custom domain ke liye ya final):
   ```bash
   npx vercel --prod
   ```

---

## Important notes

- **Admin / localStorage:** Admin panel (login, profile, projects) **localStorage** use karta hai. Har device/browser alag data rakhega. Agar aap chahte ho ki data sab jagah same ho to baad mein backend (e.g. Vercel Serverless + DB) add karna padega.
- **Resume PDF link:** Admin → Profile mein "Resume download link" daal sakte ho (e.g. Google Drive PDF link). Site live hone ke baad wahi link "Download Resume" par kaam karega.
- **Assets:** `assets/` folder (CSS, JS, images) automatically deploy hoga.
