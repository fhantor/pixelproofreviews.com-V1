import { getBlogPosts, getCategories, getPosts } from '@/lib/wordpress';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, BookOpen, PenLine, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WPPost, WPCategory, PaginationInfo } from '@/lib/types';
import { decodeHtml } from '@/lib/utils';

export const metadata: Metadata = {
  alternates: {
    canonical: '/blog',
  },
};

function BlogCard({ post }: { post: WPPost }) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredMedia?.source_url;
  const title = decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''));
  const excerpt = decodeHtml(
    post.excerpt.rendered.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  );
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="group hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative flex-shrink-0 w-full sm:w-56 h-44 sm:h-auto overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 224px"
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[11rem] bg-purple-50 dark:bg-purple-950/40">
                <PenLine className="h-10 w-10 text-purple-300 dark:text-purple-700" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 font-medium text-xs border-0">
                Blog
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {date}
              </span>
            </div>

            <h2
              className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {title}
            </h2>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {excerpt.length > 180 ? excerpt.slice(0, 180) + '…' : excerpt}
            </p>

            <div className="mt-3 pt-3 border-t border-border">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                Read Article
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default async function BlogPage() {
  let posts: WPPost[] = [];
  let pagination: PaginationInfo = { currentPage: 1, totalPages: 1, totalPosts: 0 };
  let categories: WPCategory[] = [];
  let recentPosts: WPPost[] = [];

  try { ({ posts, pagination } = await getBlogPosts(1)); } catch { /* API unavailable */ }
  try { categories = await getCategories(); } catch { /* API unavailable */ }
  try { ({ posts: recentPosts } = await getPosts(1)); } catch { /* API unavailable */ }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zm40 0h-1v40h1zM0 0v1h40V0zm0 40v-1h40v1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-white/10 text-purple-100 border border-white/20 gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-200" />
              Tutorials, Tips &amp; Insights
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              The Pixel Proof{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                Blog
              </span>
            </h1>

            <p className="text-lg text-purple-100 leading-relaxed">
              Actionable strategies, honest insights, and digital marketing know-how — from 12+ years in the industry.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-100">Marketing Tips</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-100">Tutorials</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <PenLine className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-100">Industry News</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 text-center py-4">
            <div className="px-4">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {pagination.totalPosts > 0 ? pagination.totalPosts : '—'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Articles</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">12+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Years Experience</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">Free</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Always Free</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Posts column */}
            <div className="lg:col-span-2">
              {/* Section header */}
              <div className="flex items-center gap-2.5 mb-6">
                <span className="block w-1 h-5 rounded-full bg-purple-600" />
                <h2 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-widest">
                  Latest Articles
                </h2>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900">
                  <BookOpen className="h-10 w-10 text-purple-300 mx-auto mb-3" />
                  <h2 className="text-lg font-semibold text-foreground">No articles yet</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Check back soon for tutorials, tips, and industry news.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
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
