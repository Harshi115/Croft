// Global bootstrap — enforces two content-safety rules that aren't expressible
// purely through content-type schemas.

export default {
  register() {},

  bootstrap({ strapi }) {
    // FR-064: alternative text is required on every media upload. The upload
    // plugin doesn't support a required field on its own model via the
    // Content-Type Builder, so it's enforced here instead. Editors can still
    // mark an image "decorative" by setting alternativeText to the literal
    // string "decorative" — that's the documented escape hatch called for
    // in the BRD, rather than silently allowing a blank value.
    strapi.db.lifecycles.subscribe({
      models: ["plugin::upload.file"],
      async beforeCreate(event: any) {
        const { data } = event.params;
        if (!data.alternativeText || !data.alternativeText.trim()) {
          throw new Error(
            "Alt text is required for every upload. Use the literal value \"decorative\" for purely decorative images."
          );
        }
      }
    });

    // FR-069: restrict uploads to permitted MIME types; SVGs are allowed but
    // must be sanitised (handled by the upload provider's SVG sanitiser —
    // confirm this is enabled for whichever provider is configured in
    // config/plugins.ts, e.g. @strapi/provider-upload-aws-s3).
    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
      "application/pdf"
    ];

    strapi.db.lifecycles.subscribe({
      models: ["plugin::upload.file"],
      async beforeCreate(event: any) {
        const { data } = event.params;
        if (data.mime && !ALLOWED_MIME_TYPES.includes(data.mime)) {
          throw new Error(`File type ${data.mime} is not permitted. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`);
        }
      }
    });
  }
};
