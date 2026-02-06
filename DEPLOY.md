# 🚀 AI Concierge - Vercel Deployment Guide

## Quick Deploy (3 Steps)

### Step 1: Go to Vercel
1. Open **https://vercel.com**
2. Sign up / Sign in with GitHub

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Select: `Royhaxors1/ai-concierge`
3. Click **"Import"**

### Step 3: Configure
| Setting | Value |
|---------|-------|
| **Root Directory** | `app` |
| **Framework Preset** | `Next.js` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |

### Step 4: Environment Variables
Click **"Environment Variables"** and add these from `.env.example`:

```
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
OPENCLAW_GATEWAY_URL=http://localhost:3001
OPENCLAW_WEBHOOK_URL=
```

### Step 5: Deploy
Click **"Deploy"** → Wait ~1 minute → Done! 🎉

---

## 🔗 Your URL Will Be

```
https://ai-concierge-xxx.vercel.app
```

---

## Auto-Deploy on Push

Once connected, every `git push` to `master` auto-deploys!

---

## Troubleshooting

### "Failed to Build"
- Check environment variables are set
- Run `npm run build` locally to debug

### "Module Not Found"
- Run `npm install` in `app/` folder
- Commit and push again

### Database Connection Failed
- Verify `DATABASE_URL` is correct
- Make sure Supabase is set up

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: Create issue in repo

---

*Generated: 2026-02-06*
