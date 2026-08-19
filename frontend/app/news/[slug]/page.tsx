import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { strapiFetch, mediaUrl, relationAttr } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import PageBanner from "@/components/PageBanner";
import BlockContent from "@/components/BlockContent";

async function getArticle(slug: string) {
  const res = await strapiFetch<any[]>(`/news-articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=heroImage,category`);
  return res.data[0] ?? null;
}

// Pulls the full published list (sorted the same way as the Media index) so
// we can work out which article comes before/after the current one, same as
// the reference site's Previous Post / Next Post pager.
async function getAdjacentArticles(slug: string) {
  try {
    const res = await strapiFetch<any[]>(`/news-articles?sort=publishDate:desc&pagination[pageSize]=200&fields[0]=slug&fields[1]=title`);
    const list = res.data.map((n) => ({ ...(n.attributes ?? n), id: n.id }));
    const index = list.findIndex((a) => a.slug === slug);
    return {
      previous: index > 0 ? list[index - 1] : null,
      next: index >= 0 && index < list.length - 1 ? list[index + 1] : null
    };
  } catch {
    return { previous: null, next: null };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const a = article.attributes ?? article;
  return buildMetadata({ title: a.metaTitle || a.title, description: a.metaDescription || a.excerpt, path: `/news/${a.slug}` });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const a = article.attributes ?? article;
  const imgUrl = mediaUrl(a.heroImage);
  const { previous, next } = await getAdjacentArticles(slug);

  return (
    <>
      <PageBanner title={a.title} breadcrumb={[{ label: "Home", href: "/" }, { label: "Media", href: "/news" }, { label: a.title }]} />

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <article className="border border-border rounded-card p-5 md:p-[30px]">
          {imgUrl && (
            <Image
              src={imgUrl}
              alt={relationAttr(a.heroImage, "alternativeText") || ""}
              width={1110}
              height={624}
              sizes="(min-width: 1024px) 1110px, 100vw"
              priority
              className="mb-[25px] h-auto w-full rounded-[10px] object-cover"
            />
          )}

          <p className="text-muted mb-5 flex items-center gap-2 text-[14px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[14px] w-[14px]">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.6-3.8 2.2-.9-1.6 3.2-1.9V6h1.5v6.6Z" />
            </svg>
            <span className="sr-only">Posted on </span>
            <time dateTime={a.publishDate}>{new Date(a.publishDate).toLocaleDateString("en-AU")}</time>
            {a.author ? <span>· {a.author}</span> : null}
          </p>

          <h2 className="mb-5 text-[36px] leading-[40px] font-light max-md:text-[26px] max-md:leading-[32px]">
            {a.title}
          </h2>

          {a.excerpt && <p className="text-lg text-stone leading-relaxed mb-6">{a.excerpt}</p>}

          <BlockContent blocks={a.body} />

          {(previous || next) && (
            <nav aria-label="More articles" className="border-t border-border mt-8 pt-5 flex flex-wrap justify-between gap-4">
              {previous ? (
                <Link href={"/news/" + previous.slug} className="text-primary text-[16px]">← Previous Post</Link>
              ) : <span />}
              {next && (
                <Link href={"/news/" + next.slug} className="text-primary text-[16px]">Next Post →</Link>
              )}
            </nav>
          )}
        </article>
      </div>
    </>
  );
}