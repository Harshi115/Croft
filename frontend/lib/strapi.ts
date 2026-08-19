// Thin fetch wrapper for the Strapi v5 REST API.
// Server-only: reads STRAPI_API_TOKEN, never exposed to the client.

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: { page: number; pageSize: number; pageCount: number; total: number };
  };
}

export async function strapiFetch<T>(
  path: string,
  { revalidate = 0 }: { revalidate?: number } = {}
): Promise<StrapiResponse<T>> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {})
    },
    next: { revalidate }
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${path} (${res.status})`);
  }

  return res.json();
}

// Strapi v5 flattens relation/media fields (no more {data:{attributes:{...}}}
// wrapping — populated fields come back as the object directly, e.g.
// { url: "...", alternativeText: "..." } instead of { data: { attributes: {...} } }).
// This accepts a raw URL string, a whole media/relation field in EITHER the
// old (v4) or new (v5) shape, and resolves the URL regardless — so call
// sites don't need to know or care which shape Strapi actually returned.
export function mediaUrl(field?: string | null | Record<string, any>) {
  if (!field) return null;

  if (typeof field === "string") {
    return field.startsWith("http") ? field : `${STRAPI_URL}${field}`;
  }

  const obj = field?.data?.attributes ?? field?.data ?? field?.attributes ?? field;
  const url = obj?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

// Same idea, for non-media relations (e.g. a Sector or Category) where you
// need a specific field like `name` off the related record, regardless of
// whether Strapi returned the v4-nested or v5-flat shape.
export function relationAttr(field: any, key: string): any {
  if (!field) return undefined;
  const obj = field?.data?.attributes ?? field?.data ?? field?.attributes ?? field;
  return obj?.[key];
}

// Same normalization, but for a *list* of related records (e.g. a gallery
// or multiple trust logos) — always returns a plain array to map over.
export function relationList(field: any): any[] {
  if (!field) return [];
  const arr = field?.data ?? field;
  return Array.isArray(arr) ? arr.map((item: any) => item?.attributes ?? item) : [];
}