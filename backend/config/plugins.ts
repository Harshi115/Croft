export default ({ env }: any) => ({
  upload: {
    config: {
      // FR-069: 20MB per-file ceiling.
      sizeLimit: 20 * 1024 * 1024,
      breakpoints: {
        // Automatic responsive sizes generated on ingest — pairs with
        // FR-068 (auto-resize) and the frontend's Next/Image `sizes` usage.
        large: 1920,
        medium: 1200,
        small: 768,
        thumbnail: 245
      }
    }
  }
});

