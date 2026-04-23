import { getPostBySlug, getCategories, getPosts } from '@/lib/wordpress';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Calendar, User, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TableOfContents from '@/components/TableOfContents';
import QualityMeter from '@/components/QualityMeter';
import PostSidebar from '@/components/PostSidebar';
import AuthorBio from '@/components/AuthorBio';
import PostNavigation from '@/components/PostNavigation';
import RelatedPosts from '@/components/RelatedPosts';
import Comments from '@/components/Comments';
import ReadingProgress from '@/components/ReadingProgress';
import SchemaMarkup from '@/components/SchemaMarkup';
import { decodeHtml, toTitleCase } from '@/lib/utils';
import { generateReviewSchema } from '@/lib/schema';

// Don't pre-generate at build time — pages are generated on-demand via ISR
export async function generateStaticParams() {
  return [];
}

const SITE_URL = 'https://www.pixelproofreviews.com';

/** Replace api pixelproofreviews.com with www pixelproofreviews.com in image URLs */
function fixImgUrl(url: string | undefined): string | undefined {
  return url?.replace('https://api.pixelproofreviews.com', SITE_URL);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    const yoast = post.yoast_head_json;
    const canonicalUrl = `${SITE_URL}/${slug}`;

    // OG image: prefer Yoast, fallback to WordPress featured media
    let ogImage: { url: string; width?: number; height?: number } | undefined;
    if (yoast?.og_image?.[0]?.url) {
      ogImage = {
        url: fixImgUrl(yoast.og_image[0].url)!,
        width: yoast.og_image[0].width,
        height: yoast.og_image[0].height,
      };
    } else {
      // Fallback: WordPress featured media via _embedded (only source_url is guaranteed)
      const featured = post._embedded?.['wp:featuredmedia']?.[0];
      if (featured?.source_url) {
        ogImage = { url: fixImgUrl(featured.source_url)! };
      }
    }

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
    return { title: 'Post Not Found' };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const categories = await getCategories().catch(() => []);
  const { posts: recentPosts } = await getPosts(1).catch(() => ({ posts: [], pagination: { currentPage: 1, totalPages: 1, totalPosts: 0 } }));
  const postCategory = post.categories?.length ? categories.find((c) => post.categories.includes(c.id)) : null;
  const relatedPosts = recentPosts
    .filter((p) => p.id !== post.id && p.categories?.some((c) => post.categories?.includes(c)))
    .slice(0, 3);

  const readTime = Math.max(1, Math.ceil(post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length / 200));

  const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://api.pixelproofreviews.com';
  const canonicalUrl = `${SITE_URL}/${slug}`;

  // Enhance content: fix URLs, add lazy loading, wrap iframes
  function enhanceContent(html: string): string {
    let subtitleMarked = false;
    return html
      // Strip injected <script> tags (Elementor sometimes adds inline scripts)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Fix relative image URLs
      .replace(/src="\/wp-content\//g, `src="${WP_API_URL}/wp-content/`)
      .replace(/src='\/wp-content\//g, `src='${WP_API_URL}/wp-content/`)
      // Fix relative srcset URLs
      .replace(/srcset="(\/wp-content\/[^"]*)"/g, (_, srcset) =>
        `srcset="${srcset.replace(/\/wp-content\//g, `${WP_API_URL}/wp-content/`)}"`)
      // Fix relative href URLs
      .replace(/href="\/wp-content\//g, `href="${WP_API_URL}/wp-content/`)
      .replace(/href='\/wp-content\//g, `href='${WP_API_URL}/wp-content/`)
      // Add lazy loading to images (avoid duplicating loading attr)
      .replace(/<img(?![^>]*\bloading\b)([^>]*)>/gi, '<img$1 loading="lazy">')
      // Wrap ALL iframes in responsive container, merging existing class attributes
      .replace(/<iframe([^>]*)>([\s\S]*?)<\/iframe>/gi, (_match, attrs, content) => {
        const newAttrs = /\bclass=/i.test(attrs)
          ? attrs.replace(/\bclass="([^"]*)"/i, 'class="$1 absolute inset-0 w-full h-full"')
          : `${attrs} class="absolute inset-0 w-full h-full"`;
        return `<div class="relative w-full aspect-video my-6 rounded-xl overflow-hidden"><iframe${newAttrs}>${content}<\/iframe><\/div>`;
      })
      // Clean up empty paragraphs
      .replace(/<p[^>]*>\s*(&nbsp;)?\s*<\/p>/gi, '')
      // Fix double line breaks
      .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>')
      // Mark the opening subtitle (first text editor paragraph after heading)
      .replace(/(<div class="elementor-widget-text-editor"[^>]*>[\s\S]*?<p[^>]*>)/gi, (match) => {
        if (!subtitleMarked) {
          subtitleMarked = true;
          return match.replace('<p', '<p class="opening-subtitle">');
        }
        return match;
      });
  }

  // Process content to add IDs to headings for TOC anchor links
  const headings: { id: string; text: string; level: number }[] = [];
  const decodedContent = decodeHtml(post.content.rendered);
  const enhancedContent = enhanceContent(decodedContent);
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

      {/* Product + Review Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': generateReviewSchema({
              postId: post.id,
              title: decodeHtml(post.title.rendered.replace(/<[^>]*>/g, '')),
              excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 300),
              url: canonicalUrl,
              imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                ? fixImgUrl(post._embedded['wp:featuredmedia'][0].source_url)
                : undefined,
              datePublished: post.date,
              dateModified: post.modified,
              author: 'Fahim',
            }),
          }),
        }}
      />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 text-dark-500 dark:text-dark-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              {postCategory && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-dark-300 dark:text-dark-600 flex-shrink-0" />
                  <Link
                    href={`/category/${postCategory.slug}`}
                    className="text-dark-500 dark:text-dark-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {toTitleCase(decodeHtml(postCategory.name))}
                  </Link>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-dark-300 dark:text-dark-600 flex-shrink-0" />
              <span className="text-dark-700 dark:text-dark-300 font-medium truncate">
                {decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''))}
              </span>
            </nav>
          </div>
        </div>

        {/* Post Title + Meta */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white leading-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''))}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-dark-500 dark:text-dark-400">
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
        </div>

        {/* Content + Sidebar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Table of Contents */}
              <TableOfContents headings={headings} />

              {/* Quality Meter */}
              <QualityMeter postId={post.id} />

              {/* Post Content */}
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
                  prose-tr:nth-child(even):bg-dark-50/50 dark:prose-tr:nth-child(even):bg-dark-800/50
                  prose-blockquote:border-l-4 prose-blockquote:border-purple-500
                  prose-blockquote:pl-4 prose-blockquote:italic
                  prose-blockquote:text-dark-600 dark:prose-blockquote:text-dark-400
                  prose-code:bg-dark-100 dark:prose-code:bg-dark-800
                  prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-dark-900 dark:prose-pre:bg-dark-950
                  prose-pre:rounded-xl prose-pre:p-4
                  prose-pre:overflow-x-auto
                  prose-hr:border-dark-200 dark:prose-hr:border-dark-700 prose-hr:my-8"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Author Bio */}
              <div className="mt-12">
                <AuthorBio />
              </div>

              {/* Post Navigation */}
              <PostNavigation post={post} categories={categories} />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <RelatedPosts posts={relatedPosts} categories={categories} />
              )}

              {/* Comments */}
              <Comments postId={post.id} />
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
