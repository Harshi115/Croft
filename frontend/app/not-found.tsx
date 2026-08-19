import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import NewsletterBand from "@/components/NewsletterBand";
import SkipLink from "@/components/SkipLink";
import AnnouncementBanner, { AnnouncementData } from "@/components/AnnouncementBanner";
import { strapiFetch, mediaUrl } from "@/lib/strapi";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Croft Developments - construction and development, delivered."
};

async function getSiteSettings() {
  try {
    const res = await strapiFetch<any>(
      "/site-setting?populate[logo]=true&populate[announcementBanner]=true",
      { revalidate: 0 }
    );
    return res.data?.attributes ?? res.data ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const announcement: AnnouncementData | undefined = settings?.announcementBanner;
  const logoUrl = mediaUrl(settings?.logo);

  return (
    <html lang="en-AU">
      <body className={`${playfair.variable} ${inter.variable} min-h-screen flex flex-col text-ink antialiased font-body`}>
        <SkipLink />
        <TopBar phone={settings?.phone} email={settings?.email} socialLinks={settings?.socialLinks} />
        <AnnouncementBanner data={announcement} />
        <Nav logoUrl={logoUrl} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <NewsletterBand />
        <Footer settings={settings} logoUrl={logoUrl} />
      </body>
    </html>
  );
}
