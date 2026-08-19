/**
 * Migrate images from LOCAL Strapi to REMOTE (Render) Strapi.
 * Uses Strapi's /api/upload endpoint with ref/refId/field so images
 * get uploaded (via Cloudinary, since remote has that provider configured)
 * AND linked back to the correct entry + field in one step.
 *
 * Run with: node migrate-images.js
 * Local Strapi must be running (npm run develop) on http://localhost:1337
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const LOCAL_URL = "http://localhost:1337";
const REMOTE_URL = "https://croft-2cp8.onrender.com";
const REMOTE_TOKEN = "ac24bf1bc009184af552ceba2ef59c8b2f5d3601da5d8349d975fd732aa7a46eebcf63fe3340d76203fae0630bab62c878d373c845f55234ea39f31c3201c1dc42d217df166b414900e7228e86ee61e95dc76e565e1c4271f36fb31b3dc6dc8ae8537009c6b2b6f470081d8449864d1f2cb26f61fbdbd5fdb4203274f58ecb88";

// content types + which fields hold media, and whether the field is single or repeatable (gallery)
const TARGETS = [
  { api: "projects", uid: "api::project.project", fields: { heroImage: "single", gallery: "multi" } },
  { api: "services", uid: "api::service.service", fields: { heroImage: "single" } },
  { api: "news-articles", uid: "api::news-article.news-article", fields: { heroImage: "single" } },
  { api: "team-members", uid: "api::team-member.team-member", fields: { photo: "single" } },
  { api: "about-pages", uid: "api::about-page.about-page", fields: { heroImage: "single", gallery: "multi" }, singleType: true, singularApi: "about-page" },
  { api: "home-pages", uid: "api::home-page.home-page", fields: { heroImage: "single", trustLogos: "multi", aboutImages: "multi", closingImage: "single" }, singleType: true, singularApi: "home-page" },
  { api: "site-settings", uid: "plugin::site-setting.site-setting", fields: { logo: "single" }, singleType: true, singularApi: "site-setting" },
];

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status} ${url}: ${text}`);
  }
  return res.json();
}

async function downloadToTemp(fileUrl) {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error(`Failed to download ${fileUrl}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const tmpPath = path.join(os.tmpdir(), path.basename(fileUrl).split("?")[0]);
  fs.writeFileSync(tmpPath, buf);
  return tmpPath;
}

async function uploadToRemote(localFilePath, filename, refUid, refId, field) {
  const form = new FormData();
  const fileBuffer = fs.readFileSync(localFilePath);
  const blob = new Blob([fileBuffer]);
  form.append("files", blob, filename);
  form.append("ref", refUid);
  form.append("refId", String(refId));
  form.append("field", field);

  const res = await fetch(`${REMOTE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REMOTE_TOKEN}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }
  return res.json();
}

function mediaUrl(media) {
  if (!media) return null;
  const url = media.url || media?.data?.attributes?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${LOCAL_URL}${url}`;
}

async function processEntry(target, entry) {
  const id = entry.id;
  for (const [field, kind] of Object.entries(target.fields)) {
    const value = entry[field];
    if (!value) continue;

    if (kind === "single") {
      const url = mediaUrl(value);
      if (!url) continue;
      try {
        const tmpPath = await downloadToTemp(url);
        await uploadToRemote(tmpPath, path.basename(tmpPath), target.uid, id, field);
        fs.unlinkSync(tmpPath);
        console.log(`  ✔ ${target.api} #${id} -> ${field}`);
      } catch (e) {
        console.error(`  ✖ ${target.api} #${id} -> ${field}: ${e.message}`);
      }
    } else if (kind === "multi") {
      const items = Array.isArray(value) ? value : value?.data || [];
      for (const item of items) {
        const url = mediaUrl(item);
        if (!url) continue;
        try {
          const tmpPath = await downloadToTemp(url);
          await uploadToRemote(tmpPath, path.basename(tmpPath), target.uid, id, field);
          fs.unlinkSync(tmpPath);
          console.log(`  ✔ ${target.api} #${id} -> ${field} (gallery item)`);
        } catch (e) {
          console.error(`  ✖ ${target.api} #${id} -> ${field} (gallery item): ${e.message}`);
        }
      }
    }
  }
}

async function main() {
  for (const target of TARGETS) {
    console.log(`\n== ${target.api} ==`);
    const populateFields = Object.keys(target.fields).join(",");
    const listUrl = target.singleType
      ? `${LOCAL_URL}/api/${target.singularApi}?populate=${populateFields}`
      : `${LOCAL_URL}/api/${target.api}?populate=${populateFields}&pagination[limit]=200`;

    let data;
    try {
      const json = await fetchJSON(listUrl);
      data = target.singleType ? [json.data] : json.data;
    } catch (e) {
      console.error(`Could not fetch ${target.api} from local: ${e.message}`);
      continue;
    }
    if (!data) continue;

    for (const raw of data) {
      const entry = raw.attributes ? { id: raw.id, ...raw.attributes } : raw;
      await processEntry(target, entry);
    }
  }
  console.log("\nDone!");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
