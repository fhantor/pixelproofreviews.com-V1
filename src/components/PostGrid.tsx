"use client"

import { useState } from "react";
import Link from "next/link";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { WPPost, WPCategory } from "@/lib/types";
import { decodeHtml, toTitleCase } from "@/lib/utils";

function mapCategoryName(name: string): string {
  if (name === 'Product Reviews') return 'All Reviews';
  return name;
}

interface PostGridProps {
  posts: WPPost[];
  categories: WPCategory[];
  currentPage: number;
  totalPages: number;
  categorySlug?: string;
}

export default function PostGrid({ posts, categories, currentPage, totalPages, categorySlug }: PostGridProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.categories?.includes(selectedCategory))
    : posts;

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)
    : null;

  const getPageUrl = (page: number) => {
    if (categorySlug) {
      return page === 1 ? `/category/${categorySlug}` : `/category/${categorySlug}/page/${page}`;
    }
    return page === 1 ? '/#posts-section' : `/page/${page}`;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 pt-8">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
          onClick={() => {
            if (currentPage > 1) window.location.href = getPageUrl(currentPage - 1);
          }}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        {startPage > 1 && (
          <>
            <Link href={getPageUrl(1)}>
              <Button variant="outline" size="sm" className="min-w-[40px]">1</Button>
            </Link>
            {startPage > 2 && <span className="text-muted-foreground px-1">...</span>}
          </>
        )}
        
        {pages.map((page) => (
          <Link key={page} href={getPageUrl(page)}>
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="min-w-[40px]"
            >
              {page}
            </Button>
          </Link>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-muted-foreground px-1">...</span>}
            <Link href={getPageUrl(totalPages)}>
              <Button variant="outline" size="sm" className="min-w-[40px]">{totalPages}</Button>
            </Link>
          </>
        )}
        
        <Link href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-5" id="posts-section" suppressHydrationWarning>
      {!categorySlug && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              {selectedCategoryName
                ? `${toTitleCase(decodeHtml(mapCategoryName(selectedCategoryName.name)))} Reviews`
                : 'Product Reviews'}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-1"
              >
                Clear filter &rarr; Show all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`cursor-pointer transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-transparent border border-input hover:bg-primary/10'
              } inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-transparent border border-input hover:bg-primary/10'
                } inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium`}
              >
                {toTitleCase(decodeHtml(mapCategoryName(category.name)))}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground">No reviews available in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} categories={categories} />
          ))}
        </div>
      )}

      {renderPagination()}
    </div>
  );
}
