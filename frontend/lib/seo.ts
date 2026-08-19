import type { Metadata } from "next";

const SITE_NAME = "Croft Developments";
const SITE_URL = "https://croft.com.au";

export function buildMetadata({
  title,
  description,
  path,
  ogImage
}: {
  title: string;
  description?: string;
  path: string;
  ogImage?: string | null;
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export { SITE_NAME, SITE_URL };
