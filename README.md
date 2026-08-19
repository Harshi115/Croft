# Croft Developments Website Rebuild — Final Scaffold

A complete, working Next.js + Strapi build for the Croft Developments website
rebuild, matching the BRD and the real croft.com.au design direction
(refined through multiple iterations — this version has every known bug
already fixed).

## What's in this build

### Backend (Strapi 5) — `backend/src/api/`
- **project, service, sector** — portfolio and services
- **news-article, news-category** — the "Media" section
- **page** — generic flexible content pages (dynamic zone / page builder)
- **home-page** (single type) — hero, carousel slides, About section,
  credibility stats, trust logos
- **about-page** (single type) — full About page content, including team
  members rendered inline (no separate "People" page)
- **team-member** — individual team profiles, shown on the About page
- **legal-page** — Privacy Policy and Terms of Use
- **site-setting** (single type) — company info, **logo**, phone, email,
  address, ABN, licence numbers, announcement banner
- **redirect** — editor-managed 301/302 redirects
- **enquiry** — contact form submissions
- **search** — real PostgreSQL full-text search (not a stub)

**Note on navigation:** the primary nav (Home/About/Projects/Media/Contact)
is fixed in code (`frontend/components/Nav.tsx`), not CMS-managed — this was
a deliberate simplification. Only the **logo** is CMS-driven, via Site
Settings.

### Frontend (Next.js 15) — `frontend/`
- Full design system: Oswald (headings) + Inter (body), Croft's real orange
  brand color, a diagonal-cut signature motif on hero/page banners
- Sticky header, dark 4-column footer, mobile-responsive nav
- Pages: Home, Projects (index + detail, filterable), Services (index +
  detail), Media/News (index + article), About (with team), Contact,
  Privacy Policy, Terms, Search, 404
- `middleware.ts` applies CMS-managed redirects
- Every page correctly uses Next.js 15's async `params`/`searchParams`

## Known bugs from earlier attempts — already fixed in this version

1. `postcss.config.js` — was missing originally, causing completely
   unstyled pages. Present in this build.
2. `next.config.js` — now correctly parses `NEXT_PUBLIC_STRAPI_URL` for
   both local (`http://localhost:1337`) and production, and allows SVG
   logos (`dangerouslyAllowSVG`).
3. `searchParams`/`params` — Next.js 15 made these `Promise`s; every page
   here already awaits them correctly.
4. Project's `status` field is named **`projectStatus`**, not `status` —
   `status` is a reserved word in Strapi 5's document system and crashes
   on publish if used directly.

## First-time setup — do this exactly, in this order

### 0. Use a short, simple path
Avoid deeply nested folders like `Downloads\some-long-name\website\backend`.
Put the Strapi project directly at something like `C:\croft-cms`. Long
nested Windows paths caused real problems last time (`ENOSPC`, file locks,
`EFTYPE` errors).

### 1. Backend (Strapi)

```bash
npx create-strapi-app@latest croft-cms --typescript --skip-cloud
```
Choose: skip cloud login → PostgreSQL → your database details → skip
example data.

**Do not run `npm audit fix --force`** at any point. It force-upgrades
Strapi's internal packages to mismatched versions and breaks the admin
panel in hard-to-diagnose ways. If `npm install` shows vulnerability
warnings, ignore them for local development.

Copy this scaffold's backend content in:
```bash
cp -r backend/src/api/*        croft-cms/src/api/
cp -r backend/src/components/*  croft-cms/src/components/
```

```bash
cd croft-cms
npm run develop
```
Open `http://localhost:1337/admin`, create your admin account.

### 2. Enable permissions — do this immediately, per content type, as you go

Settings → Users & Permissions Plugin → Roles → Public. For **each** of
these, tick `find` and `findOne`, then Save immediately (don't batch them
all at the end — it's easy to lose track):

`project`, `service`, `sector`, `news-article`, `news-category`, `page`,
`home-page`, `about-page`, `legal-page`, `team-member`, `site-setting`.

Leave `enquiry` and `redirect` with no public access.

**Tip:** if a content type doesn't appear in this list after adding it,
hard-refresh the browser tab (`Ctrl+Shift+R`) — the admin panel is a
cached single-page app and doesn't always pick up new content types
without a forced reload.

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<create a read-only token in Strapi: Settings → API Tokens>
```

```bash
npm run dev
```
Open `http://localhost:3000`.

## Filling in content — do this in order

1. **Sector** — Residential, Commercial, Aged Care
2. **Site Settings** — companyName, **logo** (upload + alt text), phone,
   email, address, abn. **Click Save and confirm a success message** — an
   unsaved single type entry causes `404` on the public API and the
   frontend silently falls back to placeholder text everywhere.
3. **Service** — 3+ entries
4. **Project** — 4-6 entries, set `projectStatus`, toggle `featured` on for
   2-3 of them
5. **News Category** + **News Article** — 3+ articles
6. **Team Member** — as many as needed
7. **Home Page** — hero heading/image or `heroCarouselSlides` (2+ for a
   slideshow), About section fields, credibility stats
8. **About Page** — heading, intro, body, founder details, stats, gallery
9. **Legal Page** — two entries, slug `privacy-policy` and slug `terms`
   (real legal text is a client dependency — don't draft this yourself)

**Every entry needs Save, and most also need Publish** (Sector, News
Category, Site Settings, Redirect, and Enquiry don't have a Publish step —
Save alone makes them live; everything else does need an explicit Publish).

**Every image upload requires alt text** — enforced server-side.

## What's intentionally not built yet

- Real content migration from the old WordPress site
- Turnstile bot-mitigation widget wiring (enquiry route is ready for it)
- Transactional email sending (stubbed with TODO comments in
  `frontend/app/api/enquiry/route.ts`)
- CSV export and automatic enquiry retention/purge
- Production hosting/deployment, CI/CD
