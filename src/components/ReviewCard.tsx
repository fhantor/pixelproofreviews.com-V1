import Link from 'next/link';
import Image from 'next/image';
import { WPPost, WPCategory } from '@/lib/types';

interface ReviewCardProps {
  post: WPPost;
  categories?: WPCategory[];
}

function getCategoryName(post: WPPost, categories?: WPCategory[]): string {
  if (!categories || !post.categories?.length) return 'Product Reviews';
  const cat = categories.find((c) => c.id === post.categories[0]);
  return cat?.name || 'Product Reviews';
}

function getCategorySlug(post: WPPost, categories?: WPCategory[]): string {
  if (!categories || !post.categories?.length) return 'product-reviews';
  const cat = categories.find((c) => c.id === post.categories[0]);
  return cat?.slug || 'product-reviews';
}

function getExcerpt(rendered: string): string {
  return rendered.replace(/<[^>]*>/g, '').slice(0, 120) + '...';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ReviewCard({ post, categories }: ReviewCardProps) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredMedia?.source_url || '/placeholder-review.jpg';
  const catName = getCategoryName(post, categories);
  const catSlug = getCategorySlug(post, categories);

  return (
    <article className="review-card group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/${post.slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={post.title.rendered.replace(/<[^>]*>/g, '')}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <div className="absolute top-3 left-3 z-10">
          <Link
            href={`/category/${catSlug}`}
            className="category-pill bg-primary-600 text-white hover:bg-primary-700"
          >
            {catName}
          </Link>
        </div>
      </div>
      <div className="p-5">
        <Link href={`/${post.slug}`}>
          <h3 className="text-lg font-display font-bold text-dark-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
            {post.title.rendered.replace(/<[^>]*>/g, '')}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-dark-500 dark:text-dark-400 line-clamp-2">
          {getExcerpt(post.excerpt.rendered)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <time className="text-xs text-dark-400 dark:text-dark-500">
            {formatDate(post.date)}
          </time>
          <Link
            href={`/${post.slug}`}
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Read More &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
