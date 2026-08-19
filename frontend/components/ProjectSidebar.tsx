import Link from "next/link";
import { strapiFetch } from "@/lib/strapi";

const STATUS_MAP: Record<string, string> = {
  current: "in-progress",
  upcoming: "planning",
  past: "completed"
};

const HEADINGS: Record<string, string> = {
  current: "Current Projects",
  upcoming: "Upcoming Projects",
  past: "Past Projects"
};

export default async function ProjectSidebar({ category, activeSlug }: { category?: string; activeSlug?: string }) {
  let items = [];
  try {
    const res = await strapiFetch("/projects?filters[projectStatus][$eq]=" + STATUS_MAP[category ?? ""] + "&fields=title,slug&pagination[limit]=20");
    items = res.data;
  } catch {}

  if (items.length === 0) return null;

  return (
    <nav aria-label={HEADINGS[category ?? ""]} className="border border-primary rounded-[4px] p-[15px]">
      <h2 className="text-dark mb-5 text-[32px] leading-[38px] font-light">
        {HEADINGS[category ?? ""]}
        <span aria-hidden="true" className="border-primary mt-2 block w-[62px] border-t" />
      </h2>
      <ul>
        {items.map((p: any) => {
          const a = p.attributes ?? p;
          const isActive = a.slug === activeSlug;
          return (
            <li key={p.id} className="border-b border-border last:border-b-0">
              <Link href={"/projects/" + a.slug} aria-current={isActive ? "page" : undefined} className={"flex items-center justify-between gap-2 py-[7px] text-[15px] " + (isActive ? "text-primary" : "text-text hover:text-primary")}>
                {a.title}
                <span aria-hidden="true">&rsaquo;</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}