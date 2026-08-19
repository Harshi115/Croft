import type { Metadata } from "next";
import { Roboto, Ubuntu, Abril_Fatface } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import NewsletterBand from "@/components/NewsletterBand";
import SkipLink from "@/components/SkipLink";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { strapiFetch, mediaUrl } from "@/lib/strapi";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-roboto" });
const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-ubuntu" });
const abril = Abril_Fatface({ subsets: ["latin"], weight: "400", variable: "--font-abril" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Croft Developments - construction and development, delivered."
};

async function getSiteSettings() {
  try {
    const res = await strapiFetch(
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
  const announcement = settings?.announcementBanner;
  const logoUrl = mediaUrl(settings?.logo);

  return (
    <html lang="en-AU">
      <body className={`${roboto.variable} ${ubuntu.variable} ${abril.variable} min-h-screen flex flex-col text-ink antialiased font-body`}>
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
