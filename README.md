# KOI Bubble Tea

An online ordering site for a bubble tea shop, built with Next.js (App Router), TypeScript, Tailwind CSS and a Neon Postgres database via Prisma.

- **Storefront** (`/`) — browse the menu, customize a drink (sugar level, toppings), add to a cart that persists in the browser, and place an order as a guest (name + phone, no account needed).
- **Admin panel** (`/admin`) — password-protected dashboard to manage drinks, toppings, and incoming orders.

## Stack

- Next.js 16 (App Router, Route Handlers as the backend), TypeScript
- Tailwind CSS v4
- Prisma 7 + `@prisma/adapter-neon` talking to Neon serverless Postgres
- Auth: signed JWT cookie (via `jose`) for the admin panel — no user accounts on the storefront

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env` and fill in your own values (a working `.env` with your Neon credentials should already be present locally — **never commit this file**):

   ```bash
   DATABASE_URL=      # Neon pooled connection string (used at runtime)
   DIRECT_URL=        # Neon direct (non-pooled) connection string (used by the Prisma CLI)
   ADMIN_USERNAME=
   ADMIN_PASSWORD=
   ADMIN_SESSION_SECRET=   # random string, e.g. `openssl rand -base64 32`
   NEXT_PUBLIC_STORE_NAME=
   NEXT_PUBLIC_STORE_LOCATION=
   ```

3. Push the Prisma schema to your database and seed sample menu data:

   ```bash
   npm run db:push
   npm run db:seed
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Storefront: http://localhost:3000
   Admin: http://localhost:3000/admin (credentials from `ADMIN_USERNAME` / `ADMIN_PASSWORD`)

## Deploying to Vercel

1. Push this repository to GitHub (see below) and import it in [Vercel](https://vercel.com/new).
2. In the Vercel project's **Environment Variables**, add the same variables listed above (`DATABASE_URL`, `DIRECT_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_STORE_NAME`, `NEXT_PUBLIC_STORE_LOCATION`). Use a fresh, strong `ADMIN_SESSION_SECRET` and `ADMIN_PASSWORD` in production — don't reuse local dev values.
3. Deploy. Vercel runs `npm run build`, which also runs `prisma generate` via the `postinstall` script.
4. The database schema/data already live in Neon from the local `db:push`/`db:seed` steps, so no extra migration step is needed on first deploy. For future schema changes, run `npm run db:push` locally (or wire up a migration step in CI) against the same `DATABASE_URL`.

### Rotating the database credential

If the Neon connection string was ever shared somewhere outside of `.env` (chat, a doc, etc.), rotate the database password from the [Neon console](https://console.neon.tech) and update `DATABASE_URL`/`DIRECT_URL` everywhere (local `.env` and Vercel env vars).

## Project structure

- `app/` — pages and API routes (App Router). `app/api/*` are the public endpoints, `app/api/admin/*` are protected.
- `components/storefront/` — customer-facing UI (menu, drink customizer, cart).
- `components/admin/` — admin dashboard UI.
- `components/DrinkArt.tsx` — renders a product photo when `imageUrl` is set, otherwise a generated illustration.
- `context/CartContext.tsx` — client-side cart state, persisted to `localStorage`.
- `lib/prisma.ts` — Prisma client singleton (Neon serverless adapter).
- `prisma/schema.prisma` — data model (drinks, toppings, orders).
- `prisma/seed.ts` — sample menu seed data.
- `middleware.ts` — protects `/admin/*` and `/api/admin/*` behind the admin session cookie.

## Product photos

A few menu items ship with real photos in `public/images/` sourced from Wikimedia Commons (Creative Commons licensed — see each file's Commons page for the specific license and required attribution before using this project's images elsewhere). Items without a photo fall back to a generated illustration. Add your own photos any time from the admin panel by pasting an image URL on a drink or topping.
