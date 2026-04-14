import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WPPost, WPCategory } from '@/lib/types';
import { decodeHtml, toTitleCase } from '@/lib/utils';

interface PostNavigationProps {
  post: WPPost;
  categories: WPCategory[];
}

function getCategoryName(post: WPPost, categories: WPCategory[]): string {
  if (!post.categories?.length) return 'Product Reviews';
  const cat = categories.find((c) => c.id === post.categories[0]);
  return toTitleCase(decodeHtml(cat?.name || 'Product Reviews'));
}

export default async function PostNavigation({ post, categories }: PostNavigationProps) {
  let allPosts: WPPost[] = [];
  try {
    allPosts = await fetchAllPosts();
  } catch {
    return null;
  }
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  if (!prevPost && !nextPost) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
      {prevPost ? (
        <Link
          href={`/${prevPost.slug}`}
          className="group flex items-center gap-3 p-5 rounded-xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-xs text-dark-400 dark:text-dark-500 font-medium">Previous Post</span>
            <h4 className="text-sm font-medium text-dark-800 dark:text-dark-200 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {decodeHtml(prevPost.title.rendered.replace(/<[^>]*>/g, ''))}
            </h4>
            <span className="text-xs text-purple-600 dark:text-purple-400 mt-1 block">
              {getCategoryName(prevPost, categories)}
            </span>
          </div>
        </Link>
      ) : (
        <div className="p-5 rounded-xl bg-dark-50 dark:bg-dark-900/50 border border-dark-100 dark:border-dark-800 opacity-50">
          <span className="text-xs text-dark-400 font-medium">Previous Post</span>
          <p className="text-sm text-dark-400 mt-1">No previous post</p>
        </div>
      )}

      {nextPost ? (
        <Link
          href={`/${nextPost.slug}`}
          className="group flex items-center justify-end gap-3 p-5 rounded-xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md transition-all"
        >
          <div className="min-w-0 text-right">
            <span className="text-xs text-dark-400 dark:text-dark-500 font-medium">Next Post</span>
            <h4 className="text-sm font-medium text-dark-800 dark:text-dark-200 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {decodeHtml(nextPost.title.rendered.replace(/<[^>]*>/g, ''))}
            </h4>
            <span className="text-xs text-purple-600 dark:text-purple-400 mt-1 block">
              {getCategoryName(nextPost, categories)}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
        </Link>
      ) : (
        <div className="p-5 rounded-xl bg-dark-50 dark:bg-dark-900/50 border border-dark-100 dark:border-dark-800 opacity-50 text-right">
          <span className="text-xs text-dark-400 font-medium">Next Post</span>
          <p className="text-sm text-dark-400 mt-1">No next post</p>
        </div>
      )}
    </div>
  );
}

async function fetchAllPosts() {
  const WP_API_URL = process.env.WORDPRESS_API_URL || 'https://api.pixelproofreviews.com';
  const allPosts: WPPost[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,title,slug,categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) break;
    const posts: WPPost[] = await res.json();
    if (posts.length === 0) {
      hasMore = false;
    } else {
      allPosts.push(...posts);
      page++;
    }
  }

  return allPosts;
}
