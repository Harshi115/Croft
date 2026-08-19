import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { strapiFetch, mediaUrl, relationAttr, relationList } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";

async function getAboutData() {
  try {
    const [aboutRes, membersRes] = await Promise.all([
      strapiFetch("/about-page?populate=heroImage,gallery"),
      strapiFetch("/team-members?populate=photo&sort=order:asc")
    ]);
    return {
      about: aboutRes.data?.attributes ?? aboutRes.data ?? null,
      members: membersRes.data ?? []
    };
  } catch {
    return { about: null, members: [] };
  }
}

export async function generateMetadata() {
  const { about: a } = await getAboutData();
  return buildMetadata({
    title: a?.metaTitle || "About",
    description: a?.metaDescription || "About Croft Developments - a family-owned commercial builder specialising in aged care.",
    path: "/about"
  });
}

const FALLBACK = {
  heading: "About Croft Developments",
  intro: "Company content pending client copy supply."
};

export default async function AboutPage() {
  const { about: a, members } = await getAboutData();
  const d = a ?? {};

  return (
    <>
      <PageBanner title={d.heading || "About"} />

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <section aria-labelledby="about-croft-group">
          <h2 id="about-croft-group" className="font-accent text-dark mb-5 text-center font-normal text-[32px] leading-[38px]">
            {d.heading || FALLBACK.heading}
          </h2>
          <div className="prose-croft mx-auto max-w-3xl">
            {d.intro && <p>{d.intro}</p>}
            {d.body ? (
              d.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p>{FALLBACK.intro}</p>
            )}
          </div>

          {(d.foundedYear || d.founderName) && (
            <div className="flex justify-center gap-10 mt-6 text-center">
              {d.founderName && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">Founder</p>
                  <p className="font-heading text-lg text-dark">{d.founderName}</p>
                </div>
              )}
              {d.foundedYear && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">Founded</p>
                  <p className="font-heading text-lg text-dark">{d.foundedYear}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Link href="/contact" className="inline-flex items-center bg-primary text-white font-medium px-7 py-3 rounded-pill hover:bg-[#d9701a] transition-colors">Get in touch</Link>
          </div>
        </section>

        {(() => {
          const galleryImages = relationList(d.gallery);
          return galleryImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-10">
              {galleryImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-card overflow-hidden bg-surfaceAlt">
                  <img src={mediaUrl(img) ?? ""} alt={img.alternativeText || ""} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          );
        })()}

        {members.length > 0 && (
          <section aria-labelledby="our-team" className="mt-16">
            <h2 id="our-team" className="font-accent text-dark mb-5 text-center font-normal text-[32px] leading-[38px]">Our Team</h2>
            {members.map((m, index) => {
              const ma = m.attributes ?? m;
              const photoUrl = mediaUrl(ma.photo);
              const imageFirst = index % 2 === 1;
              const portrait = (
                <div className="flex justify-center pt-[30px] lg:pt-[50px]">
                  {photoUrl && (
                    <img src={photoUrl} alt={relationAttr(ma.photo, "alternativeText") || ma.name} className="h-[220px] w-[220px] rounded-full border border-[#ebebeb] object-cover shadow-[0_0_5px_rgba(0,0,0,0.2)] lg:h-[300px] lg:w-[300px]" />
                  )}
                </div>
              );
              const details = (
                <div className="pt-[30px]">
                  <h3 className="mb-5 text-[28px] leading-[32px] font-light">{ma.name}</h3>
                  <div className="border-b border-border mb-5 pb-2.5">
                    <p className="m-0 text-[15px] leading-[26px] capitalize">{ma.role}</p>
                  </div>
                  {ma.bio && <div className="prose-croft"><p>{ma.bio}</p></div>}
                </div>
              );
              return (
                <article key={m.id} className="grid items-start gap-[30px] pb-[30px] lg:grid-cols-3">
                  {imageFirst ? (
                    <>
                      <div className="lg:order-1">{portrait}</div>
                      <div className="lg:order-2 lg:col-span-2">{details}</div>
                    </>
                  ) : (
                    <>
                      <div className="lg:order-2">{portrait}</div>
                      <div className="lg:order-1 lg:col-span-2">{details}</div>
                    </>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </>
  );
}
