import { getPosts, getCategories } from '@/lib/wordpress';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostGrid from '@/components/PostGrid';
import Sidebar from '@/components/Sidebar';

// Don't pre-generate at build time — pages are generated on-demand via ISR
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return {
    alternates: {
      canonical: `/page/${page}`,
    },
  };
}

export default async function PaginatedHome({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  // Redirect /page/1 to homepage
  if (pageNumber === 1) redirect('/');

  if (pageNumber < 1) notFound();

  let posts: any[] = [];
  let pagination = { currentPage: pageNumber, totalPages: pageNumber, totalPosts: 0 };
  let categories: any[] = [];
  let latestPosts: any[] = [];
  let apiSucceeded = false;

  try {
    const result = await getPosts(pageNumber);
    posts = result.posts;
    pagination = result.pagination;
    apiSucceeded = true;
  } catch {
    // API unavailable — render empty page
  }

  try {
    const result = await getPosts(1);
    latestPosts = result.posts;
  } catch {
    // API unavailable
  }

  try {
    categories = await getCategories();
  } catch {
    // API unavailable
  }

  // Only 404 if we got a real response and the page is genuinely out of range
  if (apiSucceeded && pageNumber > pagination.totalPages) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />
      
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PostGrid
                posts={posts}
                categories={categories}
                currentPage={pageNumber}
                totalPages={pagination.totalPages}
              />
            </div>
            
            <div className="lg:col-span-1">
              <Sidebar categories={categories} recentPosts={latestPosts as any} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
