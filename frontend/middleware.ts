import { NextRequest, NextResponse } from "next/server";

// Applies the redirect map (Section 21, D-6) so retired WordPress URLs 301
// to their new destinations without a code deploy — editors manage the
// `redirect` collection in Strapi (FR-071).
//
// Cached in-memory and refreshed periodically; for very large redirect sets
// consider moving this to an edge KV store instead.

let cache: { source: string; destination: string; permanent: boolean }[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function loadRedirects() {
  if (cache && Date.now() - cachedAt < CACHE_TTL_MS) return cache;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/redirects?pagination[limit]=1000`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    const json = await res.json();
    cache = json.data.map((r: any) => ({
      source: r.attributes?.source ?? r.source,
      destination: r.attributes?.destination ?? r.destination,
      permanent: r.attributes?.permanent ?? r.permanent
    }));
    cachedAt = Date.now();
  } catch {
    cache = cache ?? [];
  }
  return cache ?? [];
}

export async function middleware(req: NextRequest) {
  const redirects = await loadRedirects();
  const match = redirects.find((r) => r.source === req.nextUrl.pathname);

  if (match) {
    const url = req.nextUrl.clone();
    url.pathname = match.destination;
    return NextResponse.redirect(url, match.permanent ? 308 : 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"]
};