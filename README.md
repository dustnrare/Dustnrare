# DUST·N·RARE — Full Stack Ecommerce

**Quiet Luxury Streetwear | New Delhi, India**

---

## 🏗️ Architecture Overview

```
dustnrare/
├── frontend/          → Next.js 14 (App Router)
│   ├── app/           → Pages & layouts
│   ├── components/    → UI components
│   ├── lib/           → Firebase, API utils
│   └── store/         → Zustand cart/auth store
│
└── backend/           → Node.js + Express
    ├── routes/        → API routes
    ├── models/        → MongoDB models
    ├── middleware/     → Auth, error handling
    └── controllers/   → Business logic
```

---

## ⚙️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router)           |
| Styling     | Tailwind CSS + Custom CSS         |
| Animations  | Framer Motion                     |
| State       | Zustand                           |
| Backend     | Node.js + Express                 |
| Database    | MongoDB + Mongoose                |
| Auth        | Firebase Authentication           |
| Payments    | Razorpay + Stripe                 |
| Storage     | Firebase Storage (product images) |
| Hosting     | Netlify (frontend) + Railway (backend) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Environment Variables

**Frontend** → `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

**Backend** → `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dustnrare
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_secret
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXX
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=https://dustnrare.netlify.app
```

### 3. Run Locally

```bash
# Terminal 1 — Backend
cd backend && npm run dev    # runs on :5000

# Terminal 2 — Frontend  
cd frontend && npm run dev   # runs on :3000
```

---

## 📦 Deployment

### Frontend → Netlify
```bash
cd frontend
npm run build
# Connect repo to Netlify → auto deploy on push
# Build command: npm run build
# Publish dir: .next
# Install netlify-plugin-nextjs
```

`netlify.toml` is pre-configured in frontend/

### Backend → Railway
```bash
# Push backend/ to Railway
# Set all env vars in Railway dashboard
# MongoDB → use MongoDB Atlas free tier
```

---

## 🔐 Firebase Setup

1. Create project at firebase.google.com
2. Enable Authentication → Phone + Google + Email/Password
3. Enable Storage for product images
4. Download service account key → paste into backend .env
5. Add your domain to Firebase authorized domains

---

## 💳 Razorpay Setup

1. Create account at razorpay.com
2. Get Key ID + Key Secret from dashboard
3. Add to both frontend and backend .env
4. Test with test keys first (rzp_test_...)
5. Webhooks → point to: `your-backend.railway.app/api/payments/webhook`

---

## 🗄️ MongoDB Collections

- `users` — customer profiles
- `products` — catalogue items
- `orders` — purchase records
- `cart` — persisted cart (optional)

---

## 📱 Features

- ✅ Full eCommerce (browse → cart → checkout)
- ✅ Firebase Auth (Phone OTP, Google, Email)
- ✅ Seller Admin Dashboard (list products, manage orders)
- ✅ Razorpay + Stripe payment
- ✅ COD support
- ✅ MongoDB product/order management
- ✅ Image upload to Firebase Storage
- ✅ Responsive + Mobile-first
- ✅ Dark mode
- ✅ Pastel luxury design system
