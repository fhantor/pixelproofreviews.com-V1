import { getCategories, getCategoryBySlug, getPostsByCategory, getPosts } from '@/lib/wordpress';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostGrid from '@/components/PostGrid';
import Sidebar from '@/components/Sidebar';
import { decodeHtml, toTitleCase } from '@/lib/utils';

export async function generateStaticParams() {
  const categories = await getCategories();
  const pages = [];
  for (const cat of categories) {
    const totalPages = Math.ceil(cat.count / 10);
    for (let i = 1; i <= totalPages; i++) {
      pages.push({ slug: cat.slug, page: String(i) });
    }
  }
  return pages;
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

  const { posts, pagination } = await getPostsByCategory(category.id, pageNumber);
  const categories = await getCategories();
  const { posts: recentPosts } = await getPosts(1);

  if (pageNumber > pagination.totalPages) notFound();

  // Redirect /category/[slug]/page/1 to /category/[slug]
  if (pageNumber === 1) redirect(`/category/${slug}`);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 text-dark-500 dark:text-dark-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home w-3.5 h-3.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>Home</span>
              </Link>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-3.5 h-3.5 text-dark-300 dark:text-dark-600 flex-shrink-0"><path d="m9 18 6-6-6-6"/></svg>
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
