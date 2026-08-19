import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { strapiFetch, mediaUrl } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Media", description: "Latest news from Croft Developments.", path: "/news" });

export default async function NewsIndexPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page || "1");
  const filter = params.category ? "filters[category][slug][$eq]=" + encodeURIComponent(params.category) + "&" : "";

  let articles = [];
  let pageCount = 1;
  try {
    const res = await strapiFetch("/news-articles?" + filter + "populate=heroImage&sort=publishDate:desc&pagination[page]=" + page + "&pagination[pageSize]=12");
    articles = res.data;
    pageCount = res.meta.pagination?.pageCount ?? 1;
  } catch {}

  return (
    <>
      <PageBanner title="Media" breadcrumb={[{ label: "Home", href: "/" }, { label: "Media" }]} />

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        {articles.length === 0 ? (
          <p className="text-text">No news articles published yet.</p>
        ) : (
          <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((n, i) => {
              const a = n.attributes ?? n;
              const imgUrl = mediaUrl(a.heroImage);
              return (
                <article key={n.id} className="group relative border border-border flex h-full flex-col overflow-hidden rounded-card bg-white transition-shadow duration-400 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                  <Link href={"/news/" + a.slug} tabIndex={-1} aria-hidden="true">
                    <span className="relative block aspect-[3/2] overflow-hidden">
                      {imgUrl ? (
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="bg-surfaceAlt absolute inset-0 block" />
                      )}
                    </span>
                  </Link>
                  <div className="relative flex flex-1 flex-col p-5">
                    <span aria-hidden="true" className="bg-primary group-hover:bg-dark group-hover:text-primary absolute top-[-25px] right-[4%] flex h-[52px] w-[52px] items-center justify-center rounded-full text-white shadow-[0_3px_10px_rgba(0,0,0,0.4)] transition-all duration-300 lg:group-hover:top-[-40px]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                        <path d="M11 5v3.2C6.5 8.8 3.6 11.8 3 17c1.9-2.6 4.5-3.8 8-3.8V16l7-5.5L11 5Z" />
                      </svg>
                    </span>
                    <h3 className="mb-2.5 font-light text-[22px] leading-[30px]">
                      <Link href={"/news/" + a.slug} className="text-dark hover:text-primary">{a.title}</Link>
                    </h3>
                    <p className="text-muted mb-2.5 flex items-center gap-2 text-[14px]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[14px] w-[14px]">
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.6-3.8 2.2-.9-1.6 3.2-1.9V6h1.5v6.6Z" />
                      </svg>
                      <time>{new Date(a.publishDate).toLocaleDateString("en-AU")}</time>
                    </p>
                    {a.excerpt && <p className="font-heading text-[15px] leading-[26px] text-text">{a.excerpt}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {pageCount > 1 && (
          <nav aria-label="Pagination" className="flex gap-2 mt-14 justify-center">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <a key={p} href={"?page=" + p} aria-current={p === page ? "page" : undefined} className={"min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border text-sm font-medium " + (p === page ? "bg-primary text-white border-primary" : "border-border text-dark hover:border-primary")}>
                {p}
              </a>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}