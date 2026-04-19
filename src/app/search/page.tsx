import { searchPosts, getCategories } from '@/lib/wordpress';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { WPPost } from '@/lib/types';

export const metadata: Metadata = {
  alternates: {
    canonical: '/search',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const categories = await getCategories().catch(() => []);

  let results: WPPost[] = [];
  if (query) {
    results = await searchPosts(query).catch(() => []);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />

      <main className="flex-1">
        {/* Header band */}
        <div className="bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-1">
              <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                {query ? `Search results for "${query}"` : 'Search Reviews'}
              </h1>
            </div>
            {query && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {results.length > 0
                  ? `${results.length} result${results.length !== 1 ? 's' : ''} found`
                  : 'No results found'}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Search form */}
          <form action="/search" method="GET" className="mb-8">
            <div className="flex gap-3 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search for tools, software, plugins..."
                  autoFocus
                  className="w-full pl-4 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 text-white text-sm font-semibold hover:from-purple-600 hover:to-purple-500 transition-all duration-200 shadow-md shadow-purple-200 dark:shadow-purple-900/40 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </form>

          {/* Results */}
          {!query ? (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Enter a keyword to search reviews</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No results for "{query}"</h2>
              <p className="text-muted-foreground mb-6">Try different keywords or browse all reviews.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors"
              >
                Browse All Reviews
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((post) => (
                <PostCard key={post.id} post={post} categories={categories} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
