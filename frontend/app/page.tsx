import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import { strapiFetch, mediaUrl, relationAttr, relationList } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Home",
  description: "Croft Developments - construction and development across residential, commercial and aged-care sectors.",
  path: "/"
});

async function getHomeData() {
  try {
    const [hero, settings, featuredRes, servicesRes, newsRes] = await Promise.all([
      strapiFetch("/home-page?populate[heroImage]=true&populate[heroCarouselSlides][populate]=image&populate[trustLogos]=true&populate[aboutImages]=true&populate[closingImage]=true"),
      strapiFetch("/site-setting"),
      strapiFetch("/projects?filters[featured][$eq]=true&populate=heroImage,sector&pagination[limit]=6"),
      strapiFetch("/services?sort=order:asc&pagination[limit]=6&populate=heroImage", { revalidate: 0 }),
      strapiFetch("/news-articles?sort=publishDate:desc&pagination[limit]=3&populate=heroImage")
    ]);

    let featured = featuredRes.data;
    if (!featured || featured.length === 0) {
      const fallback = await strapiFetch("/projects?populate=heroImage,sector&sort=publishedAt:desc&pagination[limit]=6");
      featured = fallback.data;
    }

    return {
      hero: hero.data?.attributes ?? hero.data ?? null,
      phone: settings.data?.attributes?.phone ?? settings.data?.phone ?? null,
      featured,
      services: servicesRes.data,
      news: newsRes.data
    };
  } catch {
    return { hero: null, phone: null, featured: [], services: [], news: [] };
  }
}

export default async function HomePage() {
  const data = await getHomeData();
  const phone = data.phone;
  const featured = data.featured;
  const services = data.services;
  const news = data.news;
  const h = data.hero ?? {};

  const manualSlides = (h.heroCarouselSlides ?? []).map((s) => ({
    image: mediaUrl(s.image) ?? "",
    heading: s.heading,
    ctaLabel: s.ctaLabel,
    ctaHref: s.ctaHref
  })).filter((s) => s.image);

  const projectSlides = featured.map((p) => {
    const a = p.attributes ?? p;
    return { image: mediaUrl(a.heroImage) ?? "", caption: a.location || a.title };
  }).filter((s) => s.image);

  const slides = manualSlides.length >= 2 ? manualSlides : projectSlides.length >= 2 ? projectSlides : undefined;

  const stats = [
    { value: h.statValue1, label: h.statLabel1 },
    { value: h.statValue2, label: h.statLabel2 },
    { value: h.statValue3, label: h.statLabel3 }
  ].filter((s) => s.value && s.label);

  const phoneHref = phone ? "tel:" + phone.replace(/[^+\d]/g, "") : "";

  return (
    <>
      <Hero eyebrow={h.heroEyebrow} heading={h.heroHeading || "Croft Developments"} supportingCopy={h.heroSupportingCopy} ctaLabel={h.heroCtaLabel} ctaHref={h.heroCtaHref || "/contact"} slides={slides} />

      {phone && (
        <div className="bg-charcoal sm:hidden">
          <a href={phoneHref} className="flex items-center justify-center gap-2 py-3 text-white font-medium min-h-[44px]">{phone}</a>
        </div>
      )}

      {stats.length > 0 && (
        <section className="bg-charcoal text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-3 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="font-heading text-3xl sm:text-5xl font-semibold text-brand-accent">{s.value}</p>
                <p className="text-xs sm:text-sm uppercase tracking-wide text-white/70 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(() => {
        const logos = relationList(h.trustLogos);
        return logos.length > 0 && (
          <section className="border-b border-black/10 py-10 bg-paper">
            <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-center gap-8">
              {logos.map((logo, i) => (
                <img key={i} src={mediaUrl(logo) ?? ""} alt={logo.alternativeText || ""} className="h-10 sm:h-12 object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition" />
              ))}
            </div>
          </section>
        );
      })()}

      <section aria-label="Featured projects" className="bg-surfaceSoft py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="font-heading text-3xl sm:text-5xl text-ink">Featured Projects</h2>
            </div>
            <Link href="/projects" className="text-sm font-medium text-ink border-b border-brand-accent pb-0.5 hover:text-brand-accent transition-colors whitespace-nowrap">
              All projects
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="text-stone">Featured projects will appear here once content is published in Strapi.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.slice(0, 4).map((p) => {
                const a = p.attributes ?? p;
                const imgUrl = mediaUrl(a.heroImage);
                const sector = a.sector?.data?.attributes?.name ?? a.sector?.name;
                return (
                  <Link
                    key={p.id}
                    href={"/projects/" + a.slug}
                    className="group block rounded-xl overflow-hidden bg-white border border-black/5 hover:shadow-lg transition-shadow focus:outline focus:outline-2 focus:outline-brand-accent"
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden bg-paper-alt">
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </span>
                    <span className="block p-5">
                      {sector && (
                        <span className="inline-block mb-2 text-[11px] uppercase tracking-wider font-semibold text-brand-accent">
                          {sector}
                        </span>
                      )}
                      <span className="font-heading text-xl leading-tight text-ink block group-hover:text-brand-accent transition-colors">{a.title}</span>
                      {a.location && <span className="text-sm text-stone mt-1 block">{a.location}</span>}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>


      <section className="bg-paper-alt py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              {h.servicesEyebrow && (
                <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-accent font-semibold mb-3">{h.servicesEyebrow}</p>
              )}
              <h2 className="font-heading text-3xl sm:text-5xl text-ink">{h.servicesHeading || "Our Services"}</h2>
            </div>
            <Link href="/services" className="text-sm font-medium text-ink border-b border-brand-accent pb-0.5 hover:text-brand-accent transition-colors whitespace-nowrap">
              {h.servicesCtaLabel || "All services"}
            </Link>
          </div>
          {services.length === 0 ? (
            <p className="text-stone">Services will appear here once entries are published in Strapi.</p>
          ) : (
            <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
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
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          {h.aboutEyebrow && (
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-accent font-semibold mb-3">{h.aboutEyebrow}</p>
          )}
          <h2 className="font-heading text-3xl sm:text-5xl text-ink mb-6">{h.aboutHeading || "About Croft Group"}</h2>
          <p className="text-lg text-stone leading-relaxed whitespace-pre-line mb-8">
            {h.aboutBody || "Company description pending - add aboutBody in Strapi Home Page."}
          </p>
          {h.aboutCtaLabel && h.aboutCtaHref && (
            <Link href={h.aboutCtaHref} className="inline-flex items-center bg-brand-accent text-white font-medium px-7 py-3.5 rounded-full min-h-[44px] hover:bg-brand-accent-dark transition-colors">
              {h.aboutCtaLabel}
            </Link>
          )}
        </div>
        {(() => {
          const images = relationList(h.aboutImages);
          return images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.slice(0, 6).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-paper-alt">
                  <img src={mediaUrl(img) ?? ""} alt={img.alternativeText || ""} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      <section className="bg-paper-alt py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              {h.newsEyebrow && (
                <p className="font-body text-xs uppercase tracking-[0.2em] text-brand-accent font-semibold mb-3">{h.newsEyebrow}</p>
              )}
              <h2 className="font-heading text-3xl sm:text-5xl text-ink">{h.newsHeading || "Media"}</h2>
            </div>
            <Link href="/news" className="text-sm font-medium text-ink border-b border-brand-accent pb-0.5 hover:text-brand-accent transition-colors whitespace-nowrap">
              {h.newsCtaLabel || "All news"}
            </Link>
          </div>
          {news.length === 0 ? (
            <p className="text-stone">News articles will appear here once entries are published in Strapi.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-3">
              {news.map((n) => {
                const a = n.attributes ?? n;
                const imgUrl = mediaUrl(a.heroImage);
                return (
                  <Link key={n.id} href={"/news/" + a.slug} className="group block bg-paper rounded-xl overflow-hidden border border-black/5 hover:shadow-lg transition-shadow">
                    {imgUrl && (
                      <div className="relative aspect-[16/10] bg-paper-alt overflow-hidden">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-heading text-lg text-ink group-hover:text-brand-accent transition-colors">{a.title}</h3>
                      <p className="text-sm text-stone mt-2">{a.excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="relative bg-charcoal text-white py-24 text-center overflow-hidden">
        {(() => {
          const featuredImg = mediaUrl(featured[0]?.attributes?.heroImage ?? featured[0]?.heroImage);
          const aboutImgs = relationList(h.aboutImages);
          const bgImg = mediaUrl(h.closingImage) ?? featuredImg ?? (aboutImgs.length > 0 ? mediaUrl(aboutImgs[0]) : null);
          return bgImg ? (
            <>
              <img src={bgImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-charcoal/60" />
            </>
          ) : null;
        })()}
        <div className="relative mx-auto max-w-2xl px-4">
          <h2 className="font-heading text-3xl sm:text-5xl mb-4">{h.closingHeading || "Ready to start a project?"}</h2>
          {phone && (
            <p className="mb-8 text-white/80">
              Call us on <a href={phoneHref} className="underline text-brand-accent">{phone}</a> or send an enquiry.
            </p>
          )}
          <Link href="/contact" className="inline-flex items-center bg-brand-accent text-white font-medium px-8 py-4 rounded-full min-h-[44px] hover:bg-brand-accent-dark transition-colors">
            {h.closingCtaLabel || "Get in touch"}
          </Link>
        </div>
      </section>
    </>
  );
}