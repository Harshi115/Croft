// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: any }) {
    console.log('=== CLOUDINARY DIAGNOSTIC ===');
    console.log('CLOUDINARY_NAME set:', !!process.env.CLOUDINARY_NAME);
    console.log('CLOUDINARY_KEY set:', !!process.env.CLOUDINARY_KEY);
    console.log('CLOUDINARY_SECRET set:', !!process.env.CLOUDINARY_SECRET);
    const uploadConfig = strapi.config.get('plugin::upload');
    console.log('Active upload provider:', JSON.stringify(uploadConfig?.provider));
    console.log('=== END DIAGNOSTIC ===');
  },
};
