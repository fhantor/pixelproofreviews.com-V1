import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://pixelproofreviews.com/sitemap.xml',
    host: 'https://pixelproofreviews.com',
  };
}
