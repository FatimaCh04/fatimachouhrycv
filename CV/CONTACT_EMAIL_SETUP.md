# Contact form – Gmail notification setup

Jab koi Contact page se "Send Message" karega, aap ko Gmail par email aayegi. Iske liye ye steps follow karein:

## 1. Google App Password banayein

1. [Google Account](https://myaccount.google.com/) → **Security**
2. **2-Step Verification** ON karein (agar pehle se nahi hai)
3. **Security** par wapas jayein → **App passwords**
4. "Select app" → **Mail**, "Select device" → **Other** (name likhein: Portfolio)
5. **Generate** → 16-character password copy karein (jaisa: `abcd efgh ijkl mnop`)

## 2. Vercel par environment variables set karein

1. [Vercel](https://vercel.com) → apna project → **Settings** → **Environment Variables**
2. Add karein:
   - **Name:** `GMAIL_USER`  
     **Value:** `fatimachoudhry94@gmail.com` (apna Gmail)
   - **Name:** `GMAIL_APP_PASSWORD`  
     **Value:** woh 16-character App Password (bina spaces: `abcdefghijklmnop`)
3. **Save** karein, phir project ko **Redeploy** karein (Deployments → … → Redeploy)

## 3. Test karein

Site open karein → Contact → Name, Email, Message bhar ke "Send Message" dabayein. Aap ke Gmail inbox mein email aani chahiye.

**Note:** API sirf **Vercel deploy** par chalegi. Local `npm run dev` mein contact form tab kaam karega jab aap `vercel dev` use karein, ya deploy karke live site par test karein.
