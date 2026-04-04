import Link from 'next/link';
import Image from 'next/image';
import { WPPost } from '@/lib/types';

interface HeroProps {
  post: WPPost;
}

export default function Hero({ post }: HeroProps) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredMedia?.source_url;

  return (
    <section className="relative rounded-2xl overflow-hidden mb-12 group">
      <Link href={`/${post.slug}`} className="block">
        <div className="relative aspect-[21/9] md:aspect-[2.5/1]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title.rendered.replace(/<[^>]*>/g, '')}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full mb-3">
              Featured Review
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight group-hover:text-primary-200 transition-colors">
              {post.title.rendered.replace(/<[^>]*>/g, '')}
            </h2>
            <p className="mt-3 text-dark-200 line-clamp-2 max-w-2xl">
              {post.excerpt.rendered.replace(/<[^>]*>/g, '')}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-dark-300">
              <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span className="text-primary-400 font-medium">Read More &rarr;</span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
