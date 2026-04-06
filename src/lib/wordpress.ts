import { WPPost, WPCategory, WPTag, WPPage, PaginationInfo } from './types';

const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://pixelproofreviews.com';
const PER_PAGE = 10;

// Fields needed for post listing/cards — excludes full content to keep responses small
const LIST_FIELDS = '_fields=id,slug,title,excerpt,date,categories,featured_media,_links';

async function fetchWP<T>(endpoint: string, retries = 3): Promise<{ data: T; headers: Headers }> {
  const url = `${WP_API_URL}/wp-json/wp/v2${endpoint}`;
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
      return { data: await res.json(), headers: res.headers };
    } catch (err) {
      lastError = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  throw lastError;
}

function getPagination(headers: Headers): PaginationInfo {
  return {
    currentPage: parseInt(headers.get('x-wp-currentpage') || '1', 10),
    totalPages: parseInt(headers.get('x-wp-totalpages') || '1', 10),
    totalPosts: parseInt(headers.get('x-wp-total') || '0', 10),
  };
}

export async function getPosts(page = 1): Promise<{ posts: WPPost[]; pagination: PaginationInfo }> {
  const { data, headers } = await fetchWP<WPPost[]>(
    `/posts?per_page=${PER_PAGE}&page=${page}&_embed=true&${LIST_FIELDS}`
  );
  return { posts: data as WPPost[], pagination: getPagination(headers) };
}

export async function getPostBySlug(slug: string): Promise<WPPost> {
  const { data } = await fetchWP<WPPost[]>(
    `/posts?slug=${slug}&_embed=true`
  );
  if (!(data as WPPost[]).length) throw new Error(`Post not found: ${slug}`);
  return (data as WPPost[])[0];
}

export async function getBlogPosts(page = 1): Promise<{ posts: WPPost[]; pagination: PaginationInfo }> {
  const { data, headers } = await fetchWP<WPPost[]>(
    `/blog?per_page=${PER_PAGE}&page=${page}&_embed=true&${LIST_FIELDS}`
  );
  return { posts: data as WPPost[], pagination: getPagination(headers) };
}

export async function getBlogPostBySlug(slug: string): Promise<WPPost> {
  const { data } = await fetchWP<WPPost[]>(
    `/blog?slug=${slug}&_embed=true`
  );
  if (!(data as WPPost[]).length) throw new Error(`Blog post not found: ${slug}`);
  return (data as WPPost[])[0];
}

export async function getCategories(): Promise<WPCategory[]> {
  const { data } = await fetchWP<WPCategory[]>('/categories?per_page=100&orderby=count&order=desc');
  return data.filter((c) => c.slug !== 'uncategorized');
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory> {
  const { data } = await fetchWP<WPCategory[]>(`/categories?slug=${slug}`);
  if (!data.length) throw new Error(`Category not found: ${slug}`);
  return data[0];
}

export async function getPostsByCategory(categoryId: number, page = 1): Promise<{ posts: WPPost[]; pagination: PaginationInfo }> {
  const { data, headers } = await fetchWP<WPPost[]>(
    `/posts?categories=${categoryId}&per_page=${PER_PAGE}&page=${page}&_embed=true&${LIST_FIELDS}`
  );
  return { posts: data as WPPost[], pagination: getPagination(headers) };
}

export async function getTags(): Promise<WPTag[]> {
  const { data } = await fetchWP<WPTag[]>('/tags?per_page=50&orderby=count&order=desc');
  return data;
}

export async function getPageBySlug(slug: string): Promise<WPPage> {
  const { data } = await fetchWP<WPPage[]>(`/pages?slug=${slug}&_embed=true`);
  if (!data.length) throw new Error(`Page not found: ${slug}`);
  return data[0];
}

export async function searchPosts(query: string): Promise<WPPost[]> {
  const { data } = await fetchWP<WPPost[]>(`/posts?search=${encodeURIComponent(query)}&per_page=10&_embed=true&${LIST_FIELDS}`);
  return data as WPPost[];
}
