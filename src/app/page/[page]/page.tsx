import { getPosts, getCategories } from '@/lib/wordpress';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostGrid from '@/components/PostGrid';
import Sidebar from '@/components/Sidebar';

export async function generateStaticParams() {
  const { pagination } = await getPosts(1);
  const totalPages = pagination.totalPages;
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
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

  const { posts, pagination } = await getPosts(pageNumber);
  const { posts: latestPosts } = await getPosts(1);
  const categories = await getCategories();

  if (pageNumber > pagination.totalPages) notFound();

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
              <Sidebar categories={categories} recentPosts={latestPosts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
