/** @type {import('next').NextConfig} */
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const strapiRemotePattern = (() => {
  if (!strapiUrl) return null;
  try {
    const { protocol, hostname } = new URL(strapiUrl);
    return { protocol: protocol.replace(":", ""), hostname };
  } catch {
    return null;
  }
})();

const nextConfig = {
  images: {
    remotePatterns: [
      // Strapi media uploads are stored on Cloudinary.
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      // Also allow the Strapi host itself (covers local dev, and any
      // media that predates the Cloudinary provider or is served directly).
      ...(strapiRemotePattern ? [strapiRemotePattern] : [])
    ]
  }
};

module.exports = nextConfig;