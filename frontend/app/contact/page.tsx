import EnquiryForm from "@/components/EnquiryForm";
import PageBanner from "@/components/PageBanner";
import { strapiFetch } from "@/lib/strapi";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Croft Developments.",
  path: "/contact"
});

async function getSettings() {
  try {
    const res = await strapiFetch<any>("/site-setting");
    return res.data?.attributes ?? res.data ?? null;
  } catch {
    return null;
  }
}

async function getArchive() {
  try {
    const res = await strapiFetch<any>("/archive-page");
    return res.data?.attributes ?? res.data ?? {};
  } catch {
    return {};
  }
}

export default async function ContactPage() {
  const settings = await getSettings();
  const archive = await getArchive();
  const phone = settings?.phone;
  const email = settings?.email || "info@croft.com.au";
  const address = settings?.address;

  return (
    <div>
      <PageBanner eyebrow={archive.contactEyebrow || "Let's Talk"} title={archive.contactHeading || "Contact Us"} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-8">
          <p className="text-stone leading-relaxed">
            {archive.contactIntro || "Tell us about your project or enquiry and we'll respond within one business day."}
          </p>

          <div className="space-y-5">
            {phone && (
              <div>
                <p className="text-xs uppercase tracking-wide text-stone mb-1">Phone</p>
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="font-heading text-xl text-ink hover:text-brand-accent transition-colors">
                  {phone}
                </a>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-stone mb-1">Email</p>
              <a href={`mailto:${email}`} className="font-heading text-xl text-ink hover:text-brand-accent transition-colors break-all">
                {email}
              </a>
            </div>
            {address && (
              <div>
                <p className="text-xs uppercase tracking-wide text-stone mb-1">Office</p>
                <p className="text-ink">{address}</p>
              </div>
            )}
          </div>

          {address && (
            <div className="mt-2 overflow-hidden rounded-xl border border-black/10">
              <iframe
                title={`Map showing ${address}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[300px] w-full border-0"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-3 bg-paper-alt rounded-2xl p-6 sm:p-10">
          <EnquiryForm sourcePage="/contact" />
        </div>
      </div>
    </div>
  );
}
