'use client';

import { WPCategory } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: WPCategory[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  return (
    <div className="relative -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max pb-2">
        <button
          onClick={() => router.push('/')}
          className={`category-pill whitespace-nowrap transition-colors ${
            activeCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-primary-100 dark:hover:bg-dark-700'
          }`}
        >
          All Reviews
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/category/${cat.slug}`)}
            className={`category-pill whitespace-nowrap transition-colors ${
              activeCategory === cat.slug
                ? 'bg-primary-600 text-white'
                : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-primary-100 dark:hover:bg-dark-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
