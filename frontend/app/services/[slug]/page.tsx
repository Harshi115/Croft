import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { strapiFetch, mediaUrl, relationAttr, relationList } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import ProjectCard from "@/components/ProjectCard";
import PageBanner from "@/components/PageBanner";
import BlockContent from "@/components/BlockContent";
import RichText from "@/components/RichText";

async function getService(slug: string) {
  const res = await strapiFetch<any[]>(
    `/services?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=heroImage,projects.heroImage,projects.sector,subsections.gallery`,
    { revalidate: 0 }
  );
  return res.data[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  const a = service.attributes ?? service;
  return buildMetadata({ title: a.metaTitle || a.title, description: a.metaDescription || a.summary, path: `/services/${a.slug}` });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();
  const a = service.attributes ?? service;
  const relatedProjects = relationList(a.projects);
  const imgUrl = mediaUrl(a.heroImage);
  const subsections = a.subsections ?? [];

  return (
    <>
      <PageBanner title={a.title} breadcrumb={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: a.title }]} />

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <article>
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

          {a.summary && <p className="text-lg text-stone leading-relaxed mb-8">{a.summary}</p>}

          {/* Legacy "body" (blocks) field — kept for services that use it instead of subsections */}
          <BlockContent blocks={a.body} />

          {/* Each subsection is one topic block from the CMS: heading, body copy and a photo gallery */}
          {subsections.map((section: any, i: number) => {
            const gallery = relationList(section.gallery);
            return (
              <section key={i} className="mb-12">
                <h2 className="font-heading text-2xl sm:text-3xl font-light text-ink mb-4">{section.heading}</h2>
                <RichText text={section.body} />
                {gallery.length > 0 && (
                  <div className="grid gap-[15px] sm:grid-cols-2 lg:grid-cols-3 mt-6">
                    {gallery.map((img: any, gi: number) => {
                      const gUrl = mediaUrl(img);
                      return gUrl ? (
                        <div key={gi} className="relative aspect-[3/2] rounded-[10px] overflow-hidden">
                          <img src={gUrl} alt={img.alternativeText || ""} className="w-full h-full object-cover" />
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </section>
            );
          })}

          <Link href={`/contact?service=${encodeURIComponent(a.title)}`} className="inline-block bg-primary text-white font-medium px-6 py-3 rounded-pill min-h-[44px] mt-4 mb-14 hover:bg-[#d9701a] transition-colors">
            Enquire about {a.title}
          </Link>

          {relatedProjects.length > 0 && (
            <>
              <h2 className="font-heading text-2xl text-ink mb-6">Related projects</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedProjects.map((p: any) => {
                  const pa = p.attributes ?? p;
                  return (
                    <ProjectCard
                      key={p.id}
                      project={{
                        slug: pa.slug,
                        title: pa.title,
                        heroImage: mediaUrl(pa.heroImage) ?? undefined,
                        sector: relationAttr(pa.sector, "name")
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}
        </article>
      </div>
    </>
  );
}