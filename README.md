# General Admin Panel

A reusable, standalone Next.js admin dashboard I built to use as a starting point for any project. It has no database dependency — everything runs on in-memory mock data that I can swap out with real API/database calls later.

---

## What's Inside

- **Dashboard** with analytics charts, stat cards, region map, and weekly profit overview
- **Studies** management — create, edit, delete studies with cover images and financial data
- **Contacts inbox** — view and manage contact form submissions with status tracking
- **Custom study requests** — filtered view of contacts that came in as custom study requests
- **Customers table** — list of registered customers with their project history
- **Profile settings** — change admin name and password
- **Login page** with session-based auth (JWT, no database)
- **RTL + LTR support** — Arabic (`ar`) and English (`en`) via next-intl
- **Responsive layout** — MUI drawer sidebar collapses on mobile

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | MUI v7 (Material UI) |
| Auth | NextAuth v5 (JWT, Credentials provider) |
| i18n | next-intl v4 |
| Charts | ApexCharts + react-apexcharts |
| Map | jsvectormap (world-merc) |
| Exports | xlsx |
| Styling | Emotion + stylis-plugin-rtl |

---

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) — it redirects to `/admin/login`.

### Default Login Credentials

```
Email:    admin@example.com
Password: Admin@123
```

> Change these in `src/lib/mock-data.ts` → `MOCK_ADMIN` before deploying.

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/              # Login page + form
│   │   ├── (dashboard)/        # All protected dashboard pages
│   │   │   ├── analytics/
│   │   │   ├── contacts/
│   │   │   ├── custom-study-requests/
│   │   │   ├── customers/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── studies/
│   │   └── studies/[id]/edit/  # Study edit page
│   └── api/admin/              # All backend API routes
│       ├── analytics/
│       ├── contacts/
│       ├── custom-study-requests/
│       ├── customers/
│       ├── profile/
│       ├── reports/
│       │   ├── contacts-status/
│       │   └── top-customers/
│       └── studies/[id]/
├── components/admin/           # All UI components
├── lib/
│   ├── mock-data.ts            # ← THE MAIN FILE TO EDIT
│   ├── auth.ts                 # NextAuth config
│   ├── auth.config.ts          # Edge-compatible auth config (middleware)
│   ├── prisma.ts               # Disabled stub (safe to ignore)
│   ├── rateLimit.ts            # Simple in-memory rate limiter
│   ├── cloudinary.tsx          # Upload widget stub
│   └── numberFormatter.ts      # Number input helpers
├── messages/
│   ├── ar.json                 # Arabic translations
│   └── en.json                 # English translations
├── i18n/
│   └── request.ts              # next-intl locale resolver
└── types/
    └── jsvectormap.d.ts        # Type declarations for the map library
```

---

## How to Connect a Real Database

All mock data lives in `src/lib/mock-data.ts`. When I'm ready to wire up a real database:

1. **Replace the functions** in `mock-data.ts` with real Prisma/DB calls (or just delete the file and update each API route directly).
2. **Restore Prisma** — update `src/lib/prisma.ts` with the real `PrismaClient` export and add the schema back.
3. **Update `auth.ts`** — replace `verifyAdminCredentials()` with a real DB lookup.
4. **Set environment variables** (see below).

The API routes under `src/app/api/admin/` are already structured to make this swap easy — each one imports from `mock-data.ts` at the top.

---

## Environment Variables

Create a `.env.local` file at the root:

```env
# Required for NextAuth — use a long random string in production
AUTH_SECRET=your-long-random-secret-here
NEXTAUTH_SECRET=your-long-random-secret-here

# Optional — only needed if using Cloudinary for image uploads
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Optional — only needed when connecting a real database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

> A dev fallback secret is hardcoded in `auth.ts` so the app works without `.env.local` during development.

---

## Data Types

These are the core data shapes defined in `mock-data.ts`. When connecting a real DB, the Prisma models should match these:

```ts
type ContactStatus = 'NEW' | 'REPLIED' | 'CLOSED'
type StudyStatus   = 'PUBLISHED' | 'COMING_SOON' | 'DRAFT'
type Sector        = 'FOOD' | 'INDUSTRIAL' | 'SERVICE' | 'COMMERCIAL' | 'TECH' | 'OTHER'
```

---

## Image Uploads

The `StudyFormDialog` component uses a Cloudinary upload widget stub. To enable real uploads:

1. Create a Cloudinary account and an **unsigned upload preset**.
2. Add the env vars above.
3. Replace `src/lib/cloudinary.tsx` with the real `next-cloudinary` implementation.

---

## i18n (Arabic / English)

- Locale is stored in a cookie called `NEXT_LOCALE`.
- Translation files: `src/messages/ar.json` and `src/messages/en.json`.
- RTL direction switches automatically when the locale is `ar`.
- To add a new language: add a JSON file in `src/messages/` and update `src/i18n/request.ts`.

---

## Auth Notes

- Session cookie name: `admin-session-token` (custom, avoids conflicts if a customer auth is added later).
- JWT strategy — no database sessions.
- The middleware at `src/lib/auth.config.ts` protects all `/admin/*` routes except `/admin/login`.
- Rate limiting on the profile/password change endpoint: 5 requests per 15 minutes per IP.

---

## Scripts

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript check without emitting
```
