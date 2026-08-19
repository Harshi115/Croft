import type { MetadataRoute } from "next";
import { strapiFetch } from "@/lib/strapi";
import { SITE_URL } from "@/lib/seo";

// FR: XML sitemap covering all published content types.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/services", "/projects", "/news", "/contact", "/privacy-policy", "/terms", "/accessibility"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date()
  }));

  try {
    const [projects, services, articles] = await Promise.all([
      strapiFetch<any[]>("/projects?fields[0]=slug&fields[1]=updatedAt&pagination[limit]=1000"),
      strapiFetch<any[]>("/services?fields[0]=slug&fields[1]=updatedAt&pagination[limit]=1000"),
      strapiFetch<any[]>("/news-articles?fields[0]=slug&fields[1]=updatedAt&pagination[limit]=1000")
    ]);

    const dynamicRoutes = [
      ...projects.data.map((p: any) => ({ url: `${SITE_URL}/projects/${p.attributes?.slug ?? p.slug}`, lastModified: p.attributes?.updatedAt })),
      ...services.data.map((s: any) => ({ url: `${SITE_URL}/services/${s.attributes?.slug ?? s.slug}`, lastModified: s.attributes?.updatedAt })),
      ...articles.data.map((a: any) => ({ url: `${SITE_URL}/news/${a.attributes?.slug ?? a.slug}`, lastModified: a.attributes?.updatedAt }))
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
