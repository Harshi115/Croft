import ProjectCard from "@/components/ProjectCard";
import PageBanner from "@/components/PageBanner";
import { strapiFetch, mediaUrl, relationAttr } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projects",
  description: "Browse Croft Developments' current, upcoming and past projects.",
  path: "/projects"
});

const TABS = [
  { key: "current", label: "Current", status: "in-progress" },
  { key: "upcoming", label: "Upcoming", status: "planning" },
  { key: "past", label: "Past", status: "completed" }
];

export default async function ProjectsIndexPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const activeTab = TABS.find((t: any) => t.key === params.status) ?? TABS[0];

  let projects = [];
  try {
    const res = await strapiFetch("/projects?filters[projectStatus][$eq]=" + activeTab.status + "&populate=heroImage,sector&pagination[limit]=24");
    projects = res.data;
  } catch {}

  return (
    <>
      <PageBanner title="Projects" />

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div role="tablist" aria-label="Project status" className="flex gap-2 mb-10 border-b border-border">
          {TABS.map((tab: any) => {
            const active = tab.key === activeTab.key;
            return (
              <a key={tab.key} href={"?status=" + tab.key} role="tab" aria-selected={active} className={"px-6 py-3 text-[16px] font-heading border-b-2 -mb-px transition-colors " + (active ? "border-primary text-primary" : "border-transparent text-dark hover:text-primary")}>
                {tab.label}
              </a>
            );
          })}
        </div>

        {projects.length === 0 ? (
          <p className="text-text">No {activeTab.label.toLowerCase()} projects published yet.</p>
        ) : (
          <ul className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: any, i: number) => {
              const a = p.attributes ?? p;
              return (
                <li key={p.id}>
                  <ProjectCard priority={i < 3} project={{ slug: a.slug, title: a.title, heroImage: mediaUrl(a.heroImage) ?? undefined, sector: relationAttr(a.sector, "name"), location: a.location }} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
