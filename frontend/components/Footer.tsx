import Link from "next/link";
import FooterEnquiryForm from "./FooterEnquiryForm";

export default function Footer({ settings, logoUrl }: { settings: any; logoUrl?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3c414c] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 items-start">
        <div>
          <p className="font-heading text-xl mb-4">About Us</p>
          <p className="text-sm text-white/70 leading-relaxed">
            {settings?.footerAboutText || "Company description pending - add in Strapi Site Settings."}
          </p>
          {settings?.abn && <p className="text-xs text-white/50 mt-4">ABN {settings.abn}</p>}
        </div>

        <div>
          <p className="font-heading text-xl mb-4">Useful Link</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="text-white/80 hover:text-brand-accent transition-colors">Home</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-brand-accent transition-colors">About</Link></li>
            <li><Link href="/projects" className="text-white/80 hover:text-brand-accent transition-colors">Projects</Link></li>
            <li><Link href="/news" className="text-white/80 hover:text-brand-accent transition-colors">Media</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-brand-accent transition-colors">Contact</Link></li>
            <li><Link href="/privacy-policy" className="text-white/80 hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-white/80 hover:text-brand-accent transition-colors">Terms of Use</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-xl mb-4">Contact Information</p>
          <ul className="space-y-3 text-sm">
            {settings?.address && (
              <li className="flex items-start gap-2 text-white/80">{settings.address}</li>
            )}
            {settings?.phone && (
              <li className="flex items-start gap-2">
                <a href={"tel:" + settings.phone.replace(/[^+\d]/g, "")} className="text-white/80 hover:text-brand-accent transition-colors">{settings.phone}</a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-start gap-2">
                <a href={"mailto:" + settings.email} className="text-white/80 hover:text-brand-accent transition-colors break-all">{settings.email}</a>
              </li>
            )}
            {!settings?.address && !settings?.phone && !settings?.email && (
              <li className="text-white/40 italic">Pending - add in Strapi Site Settings.</li>
            )}
          </ul>

          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-white/50 mb-3">Social Share</p>
              <div className="flex gap-3">
                {settings.socialLinks.map((s: any) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-accent transition-colors text-sm">
                    {s.platform === "linkedin" && "in"}
                    {s.platform === "youtube" && "YT"}
                    {s.platform === "facebook" && "f"}
                    {s.platform === "instagram" && "ig"}
                    {!["linkedin", "youtube", "facebook", "instagram"].includes(s.platform) && s.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="font-heading text-xl mb-4">Contact Us</p>
          <FooterEnquiryForm />
        </div>
      </div>

      <div className="bg-[#2c2f36]">
        <p className="text-center text-xs text-white/50 py-6">
          {"\u00A9"} {year} {settings?.companyName || "Croft Developments Pty Ltd"}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
