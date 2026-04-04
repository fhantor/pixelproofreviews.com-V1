import ReviewCard from '@/components/ReviewCard';
import { WPPost, WPCategory } from '@/lib/types';

interface RelatedPostsProps {
  posts: WPPost[];
  categories: WPCategory[];
}

export default function RelatedPosts({ posts, categories }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-dark-100 dark:border-dark-800">
      <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
        Related Reviews
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ReviewCard key={post.id} post={post} categories={categories} />
        ))}
      </div>
    </section>
  );
}
