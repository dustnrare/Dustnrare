# DUST·N·RARE — Quick Setup Reference

> Full guide is in the walkthrough.md artifact. This is the quick-start cheatsheet.

## Run Locally

```bash
cd frontend
npm install
# Fill in .env.local (copy from .env.example and add your keys)
npm run dev
# → http://localhost:3000
# → Admin at http://localhost:3000/admin
```

## Required Environment Variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (keep secret!) |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (free) or `orders@yourdomain.com` |
| `ORDER_WHATSAPP` | Your WhatsApp number: `91XXXXXXXXXX` |
| `ORDER_EMAIL` | Your Gmail/email for order notifications |
| `ADMIN_PASSWORD` | Choose a strong password for /admin |

## Deploy to Netlify

1. Push code to GitHub (`.env.local` must be in `.gitignore`)
2. Netlify → New Site → Import from Git → select repo
3. Build settings:
   - Base dir: `frontend`
   - Build command: `npm install && npm run build`
   - Publish dir: `frontend/.next`
4. Add all env vars in Netlify → Site Settings → Environment Variables
5. Deploy!

## Supabase Database Setup

1. Supabase → SQL Editor → paste contents of `frontend/supabase-schema.sql` → Run
2. Supabase → Storage → Create bucket `product-images` → make it **Public**

## Admin Panel

- URL: `https://yoursite.netlify.app/admin`
- Password: whatever you set as `ADMIN_PASSWORD`
- Features: manage orders, add/edit/delete products, update stock, upload images

## Order Flow

Customer → Checkout → WhatsApp/Email button → Order saved to Supabase →
You get notified → Confirm order → Customer pays via UPI → Ship → Update tracking in admin
