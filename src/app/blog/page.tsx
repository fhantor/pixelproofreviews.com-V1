import { getBlogPosts, getCategories, getPosts } from '@/lib/wordpress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default async function BlogPage() {
  const { posts } = await getBlogPosts(1);
  const categories = await getCategories();
  const { posts: recentPosts } = await getPosts(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />

      <main className="flex-1">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-display font-bold text-dark-900 dark:text-white mb-2">
            Blog
          </h1>
          <p className="text-dark-500 dark:text-dark-400 mb-8">
            Tutorials, industry news, tips, and insights from Fahim.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => {
                    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
                    return (
                      <article key={post.id} className="bg-white dark:bg-dark-900 rounded-xl shadow-md border border-dark-100 dark:border-dark-800 overflow-hidden flex flex-col sm:flex-row">
                        {featuredMedia && (
                          <div className="sm:w-48 h-48 sm:h-auto relative flex-shrink-0">
                            <img
                              src={featuredMedia.source_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1">
                          <Link href={`/blog/${post.slug}`}>
                            <h2 className="text-xl font-display font-bold text-dark-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              {post.title.rendered.replace(/<[^>]*>/g, '')}
                            </h2>
                          </Link>
                          <time className="text-sm text-dark-400 mt-2 block">
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </time>
                          <p className="mt-2 text-dark-600 dark:text-dark-400 line-clamp-2">
                            {post.excerpt.rendered.replace(/<[^>]*>/g, '')}
                          </p>
                          <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700">
                            Read More &rarr;
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-dark-50 dark:bg-dark-900 rounded-xl">
                  <h2 className="text-xl font-semibold text-dark-700 dark:text-dark-300">No blog posts yet</h2>
                  <p className="mt-2 text-dark-500 dark:text-dark-400">Check back soon for tutorials, tips, and industry news.</p>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              <Sidebar categories={categories} recentPosts={recentPosts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
