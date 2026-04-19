import { getCategories, getCategoryBySlug, getPostsByCategory, getPosts } from '@/lib/wordpress';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostGrid from '@/components/PostGrid';
import Sidebar from '@/components/Sidebar';
import { decodeHtml, toTitleCase } from '@/lib/utils';

// Don't pre-generate at build time — pages are generated on-demand via ISR
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; page: string }> }) {
  const { slug, page } = await params;
  return {
    alternates: {
      canonical: `/category/${slug}/page/${page}`,
    },
  };
}

export default async function PaginatedCategoryPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}) {
  const { slug, page } = await params;
  const pageNumber = parseInt(page, 10);

  if (pageNumber < 1) notFound();

  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  let posts: any[] = [];
  let pagination = { currentPage: pageNumber, totalPages: pageNumber, totalPosts: 0 };
  let categories: any[] = [];
  let recentPosts: any[] = [];

  try { ({ posts, pagination } = await getPostsByCategory(category.id, pageNumber)); } catch { /* API unavailable */ }
  try { categories = await getCategories(); } catch { /* API unavailable */ }
  try { ({ posts: recentPosts } = await getPosts(1)); } catch { /* API unavailable */ }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />

      <main className="flex-1">
        {/* Category Title */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {toTitleCase(decodeHtml(category.name))}
          </h1>
          <p className="mt-1 text-sm text-dark-400 dark:text-dark-500">
            Page {pageNumber} · {category.count} review{category.count !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PostGrid
                posts={posts}
                categories={categories}
                currentPage={pageNumber}
                totalPages={pagination.totalPages}
                categorySlug={slug}
              />
            </div>

            <div className="lg:col-span-1">
              <Sidebar categories={categories} recentPosts={recentPosts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
