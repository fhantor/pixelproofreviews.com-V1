import { getBlogPostBySlug, getCategories, getPosts } from '@/lib/wordpress';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Home, Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import TableOfContents from '@/components/TableOfContents';
import AuthorBio from '@/components/AuthorBio';
import PostSidebar from '@/components/PostSidebar';
import SchemaMarkup from '@/components/SchemaMarkup';
import { decodeHtml } from '@/lib/utils';

export async function generateStaticParams() {
  return [];
}

const SITE_URL = 'https://www.pixelproofreviews.com';

function fixImgUrl(url: string | undefined): string | undefined {
  return url?.replace('https://api.pixelproofreviews.com', SITE_URL);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug);
    const yoast = post.yoast_head_json;
    const canonicalUrl = `${SITE_URL}/blog/${slug}`;
    let ogImage = yoast?.og_image?.[0]
      ? {
          url: fixImgUrl(yoast.og_image[0].url)!,
          width: yoast.og_image[0].width,
          height: yoast.og_image[0].height,
        }
      : undefined;

    return {
      title: yoast?.title || decodeHtml(post.title.rendered.replace(/<[^>]*>/g, '')),
      description: yoast?.description || post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        url: canonicalUrl,
        title: yoast?.og_title || yoast?.title || decodeHtml(post.title.rendered.replace(/<[^>]*>/g, '')),
        description: yoast?.og_description || yoast?.description || post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
        images: ogImage ? [ogImage] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: yoast?.og_title || yoast?.title || decodeHtml(post.title.rendered.replace(/<[^>]*>/g, '')),
        description: yoast?.og_description || yoast?.description || post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
        images: ogImage ? [ogImage.url] : undefined,
      },
    };
  } catch {
    return { title: 'Blog Post Not Found' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  const categories = await getCategories().catch(() => []);
  const { posts: recentPosts } = await getPosts(1).catch(() => ({ posts: [], pagination: { currentPage: 1, totalPages: 1, totalPosts: 0 } }));

  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const title = decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''));
  const readTime = Math.max(1, Math.ceil(post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length / 200));

  const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://api.pixelproofreviews.com';
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  function enhanceContent(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/src="\/wp-content\//g, `src="${WP_API_URL}/wp-content/`)
      .replace(/src='\/wp-content\//g, `src='${WP_API_URL}/wp-content/`)
      .replace(/srcset="(\/wp-content\/[^"]*)"/g, (_, srcset) =>
        `srcset="${srcset.replace(/\/wp-content\//g, `${WP_API_URL}/wp-content/`)}"`)
      .replace(/href="\/wp-content\//g, `href="${WP_API_URL}/wp-content/`)
      .replace(/href='\/wp-content\//g, `href='${WP_API_URL}/wp-content/`)
      .replace(/<img(?![^>]*\bloading\b)([^>]*)>/gi, '<img$1 loading="lazy">')
      .replace(/<iframe([^>]*)>([\s\S]*?)<\/iframe>/gi, (_match, attrs, content) => {
        const newAttrs = /\bclass=/i.test(attrs)
          ? attrs.replace(/\bclass="([^"]*)"/i, 'class="$1 absolute inset-0 w-full h-full"')
          : `${attrs} class="absolute inset-0 w-full h-full"`;
        return `<div class="relative w-full aspect-video my-6 rounded-xl overflow-hidden"><iframe${newAttrs}>${content}<\/iframe><\/div>`;
      })
      .replace(/<p[^>]*>\s*(&nbsp;)?\s*<\/p>/gi, '')
      .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>');
  }

  const headings: { id: string; text: string; level: number }[] = [];
  const enhancedContent = enhanceContent(decodeHtml(post.content.rendered));
  const processedContent = enhancedContent.replace(
    /<(h[23])[^>]*>(.*?)<\/\1>/gi,
    (match, tag, content) => {
      const id = `heading-${headings.length}`;
      const text = content.replace(/<[^>]*>/g, '').trim();
      headings.push({ id, text, level: tag === 'h2' ? 2 : 3 });
      return `<${tag} id="${id}">${content}<\/${tag}>`;
    }
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ReadingProgress />
      <Header categories={categories} />

      <SchemaMarkup yoastSchema={post.yoast_head_json?.schema} url={canonicalUrl} />

      {/* Breadcrumb */}
      <div className="bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1 text-dark-500 dark:text-dark-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-dark-300 dark:text-dark-600 flex-shrink-0" />
            <Link href="/blog" className="text-dark-500 dark:text-dark-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-dark-300 dark:text-dark-600 flex-shrink-0" />
            <span className="text-dark-700 dark:text-dark-300 font-medium truncate">{title}</span>
          </nav>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Featured Image */}
          {featuredMedia && (
            <div className="relative aspect-[16/9] mb-8 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={featuredMedia.source_url}
                alt={featuredMedia.alt_text || title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 960px"
              />
            </div>
          )}

          {/* Title + Meta */}
          <h1
            className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white leading-tight mb-4"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-border text-sm text-dark-500 dark:text-dark-400">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>By Fahim</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          </div>

          {/* Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Article */}
            <div className="lg:col-span-2">
              <TableOfContents headings={headings} />

              <article
                className="wp-content prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-dark-900 dark:prose-headings:text-dark-50
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
                  prose-p:text-dark-600 dark:prose-p:text-dark-400 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:my-6 prose-img:max-w-full prose-img:h-auto
                  prose-figure:my-6
                  prose-figcaption:text-sm prose-figcaption:text-dark-500 dark:prose-figcaption:text-dark-400 prose-figcaption:mt-2 prose-figcaption:text-center
                  prose-ul:text-dark-600 dark:prose-ul:text-dark-400 prose-ul:pl-6
                  prose-ol:text-dark-600 dark:prose-ol:text-dark-400 prose-ol:pl-6
                  prose-li:mb-2
                  prose-table:border-collapse prose-table:w-full prose-table:my-6
                  prose-th:border prose-th:border-dark-200 dark:prose-th:border-dark-700
                  prose-th:bg-dark-50 dark:prose-th:bg-dark-800
                  prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
                  prose-td:border prose-td:border-dark-200 dark:prose-td:border-dark-700
                  prose-td:px-4 prose-td:py-2
                  prose-blockquote:border-l-4 prose-blockquote:border-purple-500
                  prose-blockquote:pl-4 prose-blockquote:italic
                  prose-blockquote:text-dark-600 dark:prose-blockquote:text-dark-400
                  prose-code:bg-dark-100 dark:prose-code:bg-dark-800
                  prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-dark-900 dark:prose-pre:bg-dark-950
                  prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto
                  prose-hr:border-dark-200 dark:prose-hr:border-dark-700 prose-hr:my-8"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Back to Blog */}
              <div className="mt-10 pt-6 border-t border-border">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>

              {/* Author Bio */}
              <div className="mt-8">
                <AuthorBio />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PostSidebar recentPosts={recentPosts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
