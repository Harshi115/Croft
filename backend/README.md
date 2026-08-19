# Croft Developments — Strapi v5 backend

This folder contains **content-type and component schemas only**, matching
BRD Section 9. It is not a full Strapi install (that requires scaffolding a
real project and a Postgres database) — drop these into a generated project:

```bash
npx create-strapi-app@latest croft-cms --quickstart --typescript
```

Then copy this folder's contents into the generated project:

```bash
cp -r src/api/*        croft-cms/src/api/
cp -r src/components/*  croft-cms/src/components/
```

## Database

Point Strapi at PostgreSQL 17 (BRD Section 12) via `config/database.ts` /
environment variables — `DATABASE_CLIENT=postgres`.

## After first boot

1. **Settings → Roles → Public**: enable `find`/`findOne` on `project`,
   `service`, `sector`, `news-article`, `news-category`, `page`. Leave
   `enquiry` and `redirect` with no public permissions — the Next.js API
   route authenticates with a scoped API token instead (FR-072: admin is
   never reachable from the public domain — deploy this on a private host
   per BRD Section 12.4).
2. Generate a read-only API token (**Settings → API Tokens**) for the
   frontend's `STRAPI_API_TOKEN`, and a separate write-scoped token limited
   to creating `enquiry` entries for the enquiry route.
3. Alt text is not yet enforced as blocking in Strapi's default upload UI
   (FR-064) — add a custom upload validation hook, or a lifecycle hook on
   media create, to reject uploads with an empty `alternativeText`.
4. `FR-057` (site search) needs a custom route — add
   `src/api/search/routes/search.ts` calling raw `to_tsvector`/`plainto_tsquery`
   queries across `project`, `service`, `news-article`, `page` via Strapi's
   `strapi.db.connection.raw(...)`.
5. Wire a webhook (**Settings → Webhooks**) to call Next.js's on-demand
   revalidation endpoint on publish/unpublish, so editors see changes appear
   without waiting for the ISR interval.

## New in this update (matches FR-002/003, FR-056/057, FR-064, FR-068/069)

- **`src/api/nav-menu`** — single type + `nav.nav-item`/`nav.nav-child` components for a CMS-editable, 2-level primary navigation (FR-002, FR-003). Add entries under **Content Manager → Navigation Menu**.
- **`src/api/search`** — a real custom route/controller implementing PostgreSQL full-text search (`to_tsvector`/`ts_rank`/`ts_headline`) across projects, services, news articles and pages (FR-056/057). This replaces the earlier placeholder the frontend was calling. Public, read-only, no auth required.
- **`config/plugins.ts`** — sets the 20MB upload size ceiling and responsive image breakpoints (FR-068/069).
- **`src/index.ts`** — bootstrap lifecycle hooks that (a) block any upload without alt text, with `"decorative"` as the documented escape hatch (FR-064), and (b) reject disallowed file types even if the upload provider would otherwise accept them (FR-069). SVG sanitisation itself still depends on your chosen upload provider having it enabled.

## Still to configure per the BRD

- Editorial roles matching Section 9/FR-062 (Editor vs Administrator).
- Draft/publish is on by default per schema (`draftAndPublish: true`).
- Media library folder structure (FR-070).
- Scheduled publishing plugin config for articles/banners (FR-067).
