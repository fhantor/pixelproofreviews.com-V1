import { MetadataRoute } from 'next';

const BASE_URL = 'https://pixelproofreviews.com';
const WP_API = process.env.WORDPRESS_API_URL || 'https://pixelproofreviews.com';

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  while (true) {
    try {
      const res = await fetch(`${WP_API}/wp-json/wp/v2${endpoint}&page=${page}&per_page=100`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const data: T[] = await res.json();
      if (!data.length) break;
      results.push(...data);
      const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
      if (page >= totalPages) break;
      page++;
    } catch {
      break;
    }
  }
  return results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/contact-me`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Review posts
  const posts = await fetchAll<{ slug: string; modified: string }>('/posts?_fields=slug,modified');
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Blog posts
  const blogPosts = await fetchAll<{ slug: string; modified: string }>('/blog?_fields=slug,modified');
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Categories
  const categories = await fetchAll<{ slug: string }>('/categories?_fields=slug&exclude=1');
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...blogPages, ...categoryPages];
}
