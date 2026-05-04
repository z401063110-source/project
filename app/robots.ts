import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/imposter-game-generator'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
