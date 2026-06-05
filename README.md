# BLUEE — Better Learning Unlimited Employee Education

An AI-powered, multi-tenant veterinary training platform.

## What this is
- **Super Admin (you / BLUEE HQ):** create courses with the AI Course Builder, publish them, see all clinics.
- **Clinic Admin:** manage staff, assign published courses, view completion.
- **Employee:** take assigned courses with interactive lessons (quizzes, flashcards, scenarios).

## Tech stack
Next.js 14 (App Router) · PostgreSQL (Neon) · Prisma · NextAuth v5 · Tailwind · Anthropic Claude API

## Setup (local)
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your values.
3. `npm run db:push`  (creates the database tables)
4. `npm run db:seed`  (creates test accounts + a sample course)
5. `npm run dev`  → open http://localhost:3000

## Test accounts (after seeding)
- Super Admin: `superadmin@bluee.app` / `admin123!`
- Clinic Admin: `admin@happypaws.com` / `admin123!`
- Employee: `alex@happypaws.com` / `employee123!`

## Deploy (Vercel)
1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add all 7 environment variables (same as `.env.local`), setting `NEXTAUTH_URL` to your live Vercel URL.
4. Deploy.
5. After first deploy, run the database setup against your Neon database:
   set `DATABASE_URL` locally to your Neon URL, then run `npm run db:push` and `npm run db:seed` once.

## Environment variables
| Name | What it is |
|---|---|
| DATABASE_URL | Neon Postgres connection string |
| AUTH_SECRET | random secret for sessions |
| NEXTAUTH_URL | your site URL |
| ANTHROPIC_API_KEY | Claude API key (for the AI Course Builder) |
| CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET | image uploads |
