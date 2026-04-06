import { getCategories, getCategoryBySlug, getPostsByCategory, getPosts } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostGrid from '@/components/PostGrid';
import Sidebar from '@/components/Sidebar';
import { decodeHtml, toTitleCase } from '@/lib/utils';

// Don't pre-generate at build time — pages are generated on-demand via ISR
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    return {
      title: `${toTitleCase(decodeHtml(category.name))} Reviews - Pixel Proof Reviews`,
      description: `Browse all ${toTitleCase(decodeHtml(category.name))} reviews on Pixel Proof Reviews.`,
    };
  } catch {
    return { title: 'Category Not Found' };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let category;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  let posts: any[] = [];
  let pagination = { currentPage: 1, totalPages: 1, totalPosts: 0 };
  let categories: any[] = [];
  let recentPosts: any[] = [];

  try { ({ posts, pagination } = await getPostsByCategory(category.id, 1)); } catch { /* API unavailable */ }
  try { categories = await getCategories(); } catch { /* API unavailable */ }
  try { ({ posts: recentPosts } = await getPosts(1)); } catch { /* API unavailable */ }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 text-dark-500 dark:text-dark-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-dark-300 dark:text-dark-600 flex-shrink-0" />
              <span className="text-dark-700 dark:text-dark-300 font-medium truncate">
                {toTitleCase(decodeHtml(category.name))}
              </span>
            </nav>
          </div>
        </div>

        {/* Category Title */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {toTitleCase(decodeHtml(category.name))}
          </h1>
          {category.description && (
            <p className="mt-2 text-dark-500 dark:text-dark-400" dangerouslySetInnerHTML={{ __html: decodeHtml(category.description) }} />
          )}
          <p className="mt-1 text-sm text-dark-400 dark:text-dark-500">
            {category.count} review{category.count !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PostGrid
                posts={posts}
                categories={categories}
                currentPage={1}
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
