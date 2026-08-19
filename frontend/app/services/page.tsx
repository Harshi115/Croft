import PageBanner from "@/components/PageBanner";
import PostCard from "@/components/PostCard";
import { strapiFetch, mediaUrl } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description: "Croft Developments' capability across the project lifecycle.",
  path: "/services"
});

export default async function ServicesIndexPage() {
  let services: any[] = [];
  try {
    services = (await strapiFetch<any[]>("/services?sort=order:asc&populate=heroImage", { revalidate: 0 })).data;
  } catch {}

  return (
    <>
      <PageBanner title="Services" breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]} />

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        {services.length === 0 ? (
          <p className="text-stone">Services will appear here once content is published in Strapi.</p>
        ) : (
          <div className="grid gap-[30px] md:grid-cols-3">
            {services.map((s: any) => {
              const a = s.attributes ?? s;
              return (
                <PostCard
                  key={s.id}
                  href={"/services/" + a.slug}
                  title={a.title}
                  image={mediaUrl(a.heroImage)}
                  excerpt={a.summary}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}