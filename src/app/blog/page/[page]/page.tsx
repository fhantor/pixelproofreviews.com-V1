import { getBlogPosts, getCategories, getPosts } from '@/lib/wordpress';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, BookOpen, PenLine, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WPPost, WPCategory, PaginationInfo } from '@/lib/types';
import { decodeHtml } from '@/lib/utils';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return {
    title: `Blog \u2014 Page ${page} | Pixel Proof Reviews`,
    alternates: {
      canonical: `/blog/page/${page}`,
    },
  };
}

function formatDate(iso: string | undefined) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function BlogCard({ post }: { post: WPPost }) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredMedia?.source_url;
  const title = decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''));
  const excerpt = decodeHtml(post.excerpt.rendered.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()).slice(0, 140);
  const readTime = Math.max(1, Math.ceil(post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length / 200));

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover transition-transform hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-purple-300" />
            </div>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(post.date)}</span>
            <span>&bull;</span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <Link href={currentPage === 2 ? '/blog' : `/blog/page/${currentPage - 1}`} className="px-3.5 py-2 rounded-lg border text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Previous</Link>
      )}
      {pages.map((p) => (
        <Link key={p} href={p === 1 ? '/blog' : `/blog/page/${p}`} className={`px-3.5 py-2 rounded-lg text-sm ${p === currentPage ? 'bg-purple-600 text-white' : 'border hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          {p}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={`/blog/page/${currentPage + 1}`} className="px-3.5 py-2 rounded-lg border text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Next</Link>
      )}
    </div>
  );
}

export default async function BlogPageNumber({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);
  if (pageNumber < 1) notFound();
  if (pageNumber === 1) redirect('/blog');

  let posts: WPPost[] = [];
  let pagination: PaginationInfo = { currentPage: 1, totalPages: 1, totalPosts: 0 };
  let categories: WPCategory[] = [];
  let recentPosts: WPPost[] = [];
  let apiSucceeded = false;

  try { ({ posts, pagination } = await getBlogPosts(pageNumber)); apiSucceeded = true; } catch { }
  try { categories = await getCategories(); } catch { }
  try { ({ posts: recentPosts } = await getPosts(1)); } catch { }

  if (apiSucceeded && pageNumber > pagination.totalPages) notFound();
  if (apiSucceeded && posts.length === 0 && pageNumber > 1) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header categories={categories} />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2.5 mb-8">
            <span className="block w-1 h-5 rounded-full bg-purple-600" />
            <h2 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-widest">Latest Articles \u2014 Page {pageNumber}</h2>
          </div>
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => <BlogCard key={post.id} post={post} />)}
              </div>
              <Pagination currentPage={pageNumber} totalPages={pagination.totalPages} />
            </>
          ) : (
            <div className="text-center py-16"><p className="text-gray-500">No articles found.</p></div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
