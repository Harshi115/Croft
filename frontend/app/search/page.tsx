import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { strapiFetch } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Search", description: "Search Croft Developments.", path: "/search" });

// Next.js 15: `searchParams` is a Promise and must be awaited before reading
// its properties — a framework requirement, not project-specific.
export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  let archive: any = {};
  try {
    const archiveRes = await strapiFetch<any>("/archive-page");
    archive = archiveRes.data?.attributes ?? archiveRes.data ?? {};
  } catch {}

  const q = params.q?.trim() || "";
  let results: any[] = [];

  if (q) {
    try {
      const res = await strapiFetch<any[]>(`/search?q=${encodeURIComponent(q)}&page=${params.page || "1"}`, { revalidate: 0 });
      results = res.data;
    } catch {}
  }

  return (
    <div>
      <PageBanner eyebrow={archive.searchEyebrow || "Find what you need"} title={archive.searchHeading || "Search"} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <form method="get" role="search" className="flex gap-2 mb-10">
          <label htmlFor="q" className="sr-only">Search Croft Developments</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            className="flex-1 border border-black/15 rounded-full px-5 py-2.5 min-h-[44px] focus:outline focus:outline-2 focus:outline-brand-accent focus:border-brand-accent"
          />
          <button type="submit" className="bg-brand-accent text-white px-6 py-2.5 rounded-full min-h-[44px] font-medium hover:bg-brand-accent-dark transition-colors">
            Search
          </button>
        </form>

        {q && results.length === 0 && (
          <div>
            <p className="text-stone mb-4">No results for "{q}". Try:</p>
            <ul className="space-y-2">
              <li><Link href="/projects" className="text-brand-accent hover:underline">Browse all projects</Link></li>
              <li><Link href="/contact" className="text-brand-accent hover:underline">Contact us directly</Link></li>
            </ul>
          </div>
        )}

        {results.length > 0 && (
          <ul className="space-y-8">
            {results.map((r: any, i: number) => (
              <li key={i}>
                <p className="text-xs uppercase tracking-wide text-stone">{r.type}</p>
                <Link href={r.url} className="font-heading font-semibold text-lg text-ink hover:text-brand-accent transition-colors">{r.title}</Link>
                <p className="text-stone mt-1" dangerouslySetInnerHTML={{ __html: r.excerptHighlighted }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
