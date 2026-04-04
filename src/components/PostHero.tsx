import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WPPost, WPCategory } from '@/lib/types';
import { decodeHtml, toTitleCase } from '@/lib/utils';

interface PostHeroProps {
  post: WPPost;
  categories: WPCategory[];
}

function getCategoryName(post: WPPost, categories: WPCategory[]): string {
  if (!post.categories?.length) return 'Product Reviews';
  const cat = categories.find((c) => c.id === post.categories[0]);
  return toTitleCase(decodeHtml(cat?.name || 'Product Reviews'));
}

function getCategorySlug(post: WPPost, categories: WPCategory[]): string {
  if (!post.categories?.length) return 'product-reviews';
  const cat = categories.find((c) => c.id === post.categories[0]);
  return cat?.slug || 'product-reviews';
}

function getReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function PostHero({ post, categories }: PostHeroProps) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const catName = getCategoryName(post, categories);
  const catSlug = getCategorySlug(post, categories);
  const readTime = getReadTime(post.content.rendered);

  return (
    <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href={`/category/${catSlug}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            {catName}
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          {decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''))}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-purple-200 mb-8">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>By Fahim</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>
        </div>

        {featuredMedia && (
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden">
            <Image
              src={featuredMedia.source_url}
              alt={featuredMedia.alt_text || decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''))}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}
      </div>
    </section>
  );
}
