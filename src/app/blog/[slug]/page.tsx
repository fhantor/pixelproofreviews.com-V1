import { getBlogPostBySlug, getCategories, getPosts } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug);
    const yoast = post.yoast_head_json;
    return {
      title: yoast?.title || post.title.rendered.replace(/<[^>]*>/g, ''),
      description: yoast?.description || post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
    };
  } catch {
    return { title: 'Blog Post Not Found' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  const categories = await getCategories();
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />

      <main className="flex-1">
        <article className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              &larr; Back to Blog
            </Link>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white leading-tight mt-4">
              {post.title.rendered.replace(/<[^>]*>/g, '')}
            </h1>

            <div className="flex items-center gap-4 mt-4 text-sm text-dark-500 dark:text-dark-400">
              <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>By Fahim</span>
            </div>

            {featuredMedia && (
              <div className="relative aspect-[16/9] mt-6 rounded-xl overflow-hidden">
                <Image
                  src={featuredMedia.source_url}
                  alt={featuredMedia.alt_text || post.title.rendered.replace(/<[^>]*>/g, '')}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            <div
              className="prose-custom mt-8"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
