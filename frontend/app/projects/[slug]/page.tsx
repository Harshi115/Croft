import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { strapiFetch, mediaUrl, relationAttr, relationList } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import Gallery from "@/components/Gallery";
import ProjectSidebar from "@/components/ProjectSidebar";
import RelatedProjects from "@/components/RelatedProjects";

async function getProject(slug) {
  const res = await strapiFetch("/projects?filters[slug][$eq]=" + encodeURIComponent(slug) + "&populate=heroImage,gallery,sector,serviceType");
  return res.data[0] ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const a = project.attributes ?? project;
  return buildMetadata({
    title: a.metaTitle || a.title,
    description: a.metaDescription || a.summary,
    path: "/projects/" + a.slug,
    ogImage: mediaUrl(a.ogImage) ?? mediaUrl(a.heroImage)
  });
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const a = project.attributes ?? project;

  const facts = [
    !a.confidential && a.client && { label: "Client", value: a.client },
    relationAttr(a.sector, "name") && { label: "Sector", value: relationAttr(a.sector, "name") },
    a.projectStatus && { label: "Status", value: a.projectStatus },
    a.completionDate && { label: "Completed", value: new Date(a.completionDate).toLocaleDateString("en-AU") },
    !a.confidential && a.value && { label: "Project value", value: a.value }
  ].filter(Boolean);

  const galleryImages = relationList(a.gallery)
    .map((img) => ({ url: mediaUrl(img), alt: img.alternativeText || "" }))
    .filter((img) => img.url);

  const heroUrl = mediaUrl(a.heroImage);

  const CATEGORY_MAP = {
    "in-progress": { label: "Current Projects", href: "/current-projects" },
    "planning": { label: "Upcoming Projects", href: "/upcoming-projects" },
    "completed": { label: "Past Projects", href: "/past-projects" }
  };
  const category = CATEGORY_MAP[a.projectStatus] || { label: "Projects", href: "/current-projects" };
  const sidebarCategory = a.projectStatus === "planning" ? "upcoming" : a.projectStatus === "completed" ? "past" : "current";

  return (
    <>
      <div className="bg-[#31343c]">
        <div className="mx-auto max-w-[1170px] px-4 py-[30px]">
          <h1 className="text-[34px] leading-[40px] sm:text-[48px] sm:leading-[52px] font-light text-white mb-3">{a.title}</h1>
          <nav aria-label="Breadcrumb" className="text-sm text-white/70">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href={category.href} className="hover:text-primary">{category.label}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{a.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div className="grid gap-[30px] lg:grid-cols-[1fr_320px]">
          <article>
            {a.location && (
              <p className="text-dark mb-[25px] text-center text-[16px] font-bold">{a.location}</p>
            )}

            {heroUrl && (
              <div className="mb-[25px] relative w-full aspect-[16/10]">
                <Image src={heroUrl} alt={relationAttr(a.heroImage, "alternativeText") || ""} fill priority quality={90} className="object-cover rounded-card" />
              </div>
            )}

            {a.summary && (
              <div className="prose-croft">
                <p>{a.summary}</p>
              </div>
            )}

            {a.testimonialQuote && (
              <blockquote className="border-l-4 border-primary pl-4 italic my-8 text-text">
                {a.testimonialQuote}
                {a.testimonialAuthor && <footer className="mt-2 text-sm not-italic">- {a.testimonialAuthor}</footer>}
              </blockquote>
            )}

            {galleryImages.length > 0 && (
              <div className="mt-[30px]">
                <Gallery images={galleryImages} />
              </div>
            )}
          </article>

          <aside>
            {facts.length > 0 && (
              <div className="border border-primary rounded-[4px] p-[15px] mb-6">
                <h2 className="text-dark mb-5 text-[24px] leading-[28px] font-light">
                  Project Details
                  <span aria-hidden="true" className="border-primary mt-2 block w-[62px] border-t" />
                </h2>
                <dl className="space-y-3">
                  {facts.map((f) => (
                    <div key={f.label} className="border-b border-border pb-2 last:border-b-0">
                      <dt className="text-xs uppercase tracking-wide text-muted">{f.label}</dt>
                      <dd className="text-[15px] text-dark font-medium">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <Link href={"/contact?project=" + encodeURIComponent(a.title)} className="block text-center bg-primary text-white font-medium px-6 py-3 rounded-pill hover:bg-[#d9701a] transition-colors mb-6">
              Enquire about this project
            </Link>

            <ProjectSidebar category={sidebarCategory} activeSlug={a.slug} />
          </aside>
        </div>
      </div>

      <RelatedProjects status={a.projectStatus} excludeSlug={a.slug} />
    </>
  );
}