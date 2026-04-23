export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  tags: number[];
  yoast_head?: string;
  yoast_head_json?: YoastHeadJson;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details?: {
        sizes: {
          thumbnail: { source_url: string; width: number; height: number };
          medium: { source_url: string; width: number; height: number };
          large: { source_url: string; width: number; height: number };
          full: { source_url: string; width: number; height: number };
        };
      };
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<WPCategory | WPTag>>;
  };
}

export interface WPPage {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  yoast_head?: string;
  yoast_head_json?: YoastHeadJson;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface YoastHeadJson {
  title: string;
  description: string;
  robots: Record<string, string>;
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  article_published_time?: string;
  article_modified_time?: string;
  og_image: Array<{
    width: number;
    height: number;
    url: string;
    type?: string;
  }>;
  author?: string;
  twitter_card: string;
  twitter_misc?: Record<string, string>;
  schema?: Record<string, unknown>;
}

export interface WPApiResponse<T> {
  data: T;
  headers: Headers;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}
