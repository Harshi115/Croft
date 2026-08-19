import PageBanner from "@/components/PageBanner";
import { buildMetadata } from "@/lib/seo";
import { strapiFetch } from "@/lib/strapi";

async function getLegalPage() {
  try {
    const res = await strapiFetch<any[]>("/legal-pages?filters[slug][$eq]=terms");
    return res.data[0]?.attributes ?? res.data[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const page = await getLegalPage();
  return buildMetadata({
    title: page?.metaTitle || "Terms of Use",
    description: page?.metaDescription,
    path: "/terms"
  });
}

export default async function TermsPage() {
  const page = await getLegalPage();

  return (
    <article>
      <PageBanner eyebrow="Legal" title={page?.title || "Terms of Use"} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        {page?.lastUpdated && (
          <p className="text-sm text-stone mb-8">Last updated: {new Date(page.lastUpdated).toLocaleDateString("en-AU")}</p>
        )}
        {page?.body ? (
          <div className="prose max-w-none text-ink whitespace-pre-line leading-relaxed">{page.body}</div>
        ) : (
          <p className="text-stone">
            Draft legal text pending (DEP-05). This placeholder must not go live â€” see BRD Section 22.
          </p>
        )}
      </div>
    </article>
  );
}
