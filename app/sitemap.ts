import type { MetadataRoute } from 'next';
import { PUBLIC_SITEMAP_ROUTES, baseUrl } from '@/lib/site';

const routeConfig: Record<string, { priority: number; changeFrequency: 'weekly' | 'monthly' }> = {
  '/': { priority: 1.0, changeFrequency: 'weekly' },
  '/how-to-play': { priority: 0.8, changeFrequency: 'monthly' },
  '/rules': { priority: 0.8, changeFrequency: 'monthly' },
  '/about': { priority: 0.5, changeFrequency: 'monthly' },
};

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SITEMAP_ROUTES.map((route) => {
    const config = routeConfig[route] ?? { priority: 0.5, changeFrequency: 'monthly' as const };
    return {
      url: new URL(route, baseUrl).toString(),
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    };
  });
}
