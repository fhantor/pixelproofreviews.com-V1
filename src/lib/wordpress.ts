import { WPPost, WPCategory, WPTag, WPPage, PaginationInfo } from './types';

const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://api.pixelproofreviews.com';
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

type MediaInfo = { source_url: string; alt_text: string };

async function fetchMediaMap(ids: number[]): Promise<Record<number, MediaInfo>> {
  if (!ids.length) return {};
  try {
    const { data } = await fetchWP<Array<{ id: number; source_url: string; alt_text: string }>>(
      `/media?include=${ids.join(',')}&_fields=id,source_url,alt_text&per_page=100`
    );
    return Object.fromEntries(data.map((m) => [m.id, { source_url: m.source_url, alt_text: m.alt_text || '' }]));
  } catch {
    return {};
  }
}

function attachMedia(posts: WPPost[], mediaMap: Record<number, MediaInfo>): WPPost[] {
  return posts.map((post) => {
    const media = post.featured_media ? mediaMap[post.featured_media] : undefined;
    if (!media) return post;
    return {
      ...post,
      _embedded: {
        ...post._embedded,
        'wp:featuredmedia': [{ source_url: media.source_url, alt_text: media.alt_text }],
      },
    };
  });
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
    `/posts?per_page=${PER_PAGE}&page=${page}&${LIST_FIELDS}`
  );
  const ids = (data as WPPost[]).map((p) => p.featured_media).filter(Boolean) as number[];
  const mediaMap = await fetchMediaMap(ids);
  return { posts: attachMedia(data as WPPost[], mediaMap), pagination: getPagination(headers) };
}

export async function getPostBySlug(slug: string): Promise<WPPost> {
  const { data } = await fetchWP<WPPost[]>(`/posts?slug=${slug}`);
  if (!(data as WPPost[]).length) throw new Error(`Post not found: ${slug}`);
  const post = (data as WPPost[])[0];
  if (post.featured_media) {
    const mediaMap = await fetchMediaMap([post.featured_media]);
    return attachMedia([post], mediaMap)[0];
  }
  return post;
}

export async function getBlogPosts(page = 1): Promise<{ posts: WPPost[]; pagination: PaginationInfo }> {
  const { data, headers } = await fetchWP<WPPost[]>(
    `/blog?per_page=${PER_PAGE}&page=${page}&${LIST_FIELDS}`
  );
  const ids = (data as WPPost[]).map((p) => p.featured_media).filter(Boolean) as number[];
  const mediaMap = await fetchMediaMap(ids);
  return { posts: attachMedia(data as WPPost[], mediaMap), pagination: getPagination(headers) };
}

export async function getBlogPostBySlug(slug: string): Promise<WPPost> {
  const { data } = await fetchWP<WPPost[]>(`/blog?slug=${slug}`);
  if (!(data as WPPost[]).length) throw new Error(`Blog post not found: ${slug}`);
  const post = (data as WPPost[])[0];
  if (post.featured_media) {
    const mediaMap = await fetchMediaMap([post.featured_media]);
    return attachMedia([post], mediaMap)[0];
  }
  return post;
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
    `/posts?categories=${categoryId}&per_page=${PER_PAGE}&page=${page}&${LIST_FIELDS}`
  );
  const ids = (data as WPPost[]).map((p) => p.featured_media).filter(Boolean) as number[];
  const mediaMap = await fetchMediaMap(ids);
  return { posts: attachMedia(data as WPPost[], mediaMap), pagination: getPagination(headers) };
}

export async function getTags(): Promise<WPTag[]> {
  const { data } = await fetchWP<WPTag[]>('/tags?per_page=50&orderby=count&order=desc');
  return data;
}

export async function getPageBySlug(slug: string): Promise<WPPage> {
  const { data } = await fetchWP<WPPage[]>(`/pages?slug=${slug}`);
  if (!data.length) throw new Error(`Page not found: ${slug}`);
  return data[0];
}

export async function searchPosts(query: string): Promise<WPPost[]> {
  const { data } = await fetchWP<WPPost[]>(`/posts?search=${encodeURIComponent(query)}&per_page=10&${LIST_FIELDS}`);
  const ids = (data as WPPost[]).map((p) => p.featured_media).filter(Boolean) as number[];
  const mediaMap = await fetchMediaMap(ids);
  return attachMedia(data as WPPost[], mediaMap);
}
