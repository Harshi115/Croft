import ProjectCard from "@/components/ProjectCard";
import { strapiFetch, mediaUrl, relationAttr } from "@/lib/strapi";

const HEADINGS: Record<string, string> = {
  "in-progress": "More Current Projects",
  planning: "More Upcoming Projects",
  completed: "More Past Projects"
};

// Foot-of-page strip on every project detail page â€” other projects with the
// same status (current / upcoming / past), excluding the one being viewed.
export default async function RelatedProjects({ status, excludeSlug }: { status: string; excludeSlug: string }) {
  let items: any[] = [];
  try {
    const res = await strapiFetch(
      `/projects?filters[projectStatus][$eq]=${status}&filters[slug][$ne]=${encodeURIComponent(excludeSlug)}&populate=heroImage,sector&pagination[limit]=3`
    );
    items = res.data;
  } catch {}

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-projects" className="bg-surfaceAlt py-14 mt-14">
      <div className="mx-auto max-w-[1170px] px-4">
        <h2 id="related-projects" className="text-center font-heading text-3xl sm:text-4xl font-light text-ink mb-10">
          {HEADINGS[status] || "More Projects"}
        </h2>
        <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p: any) => {
            const a = p.attributes ?? p;
            return (
              <ProjectCard
                key={p.id}
                project={{
                  slug: a.slug,
                  title: a.title,
                  heroImage: mediaUrl(a.heroImage) ?? undefined,
                  sector: relationAttr(a.sector, "name"),
                  location: a.location
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}