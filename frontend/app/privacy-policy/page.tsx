import PageBanner from "@/components/PageBanner";
import { buildMetadata } from "@/lib/seo";
import { strapiFetch } from "@/lib/strapi";

async function getLegalPage() {
  try {
    const res = await strapiFetch<any[]>("/legal-pages?filters[slug][$eq]=privacy-policy");
    return res.data[0]?.attributes ?? res.data[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const page = await getLegalPage();
  return buildMetadata({
    title: page?.metaTitle || "Privacy Policy",
    description: page?.metaDescription,
    path: "/privacy-policy"
  });
}

// FR-088+: content sourced from the `legal-page` collection (slug: privacy-policy)
// so Croft's nominated privacy contact and legal text stay editable without a
// deploy. Falls back to a clearly-marked placeholder until that content exists —
// real legal text is a client dependency (DEP-05), not something to draft here.
export default async function PrivacyPolicyPage() {
  const page = await getLegalPage();

  return (
    <article>
      <PageBanner eyebrow="Legal" title={page?.title || "Privacy Policy"} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        {page?.lastUpdated && (
          <p className="text-sm text-stone mb-8">Last updated: {new Date(page.lastUpdated).toLocaleDateString("en-AU")}</p>
        )}
        {page?.body ? (
          <div className="prose max-w-none text-ink whitespace-pre-line leading-relaxed">{page.body}</div>
        ) : (
          <p className="text-stone">
            Draft legal text pending (DEP-05). This placeholder must not go live — see BRD Section 22.
          </p>
        )}
      </div>
    </article>
  );
}
