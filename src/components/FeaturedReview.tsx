'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, ArrowRight, Clock, Calendar } from "lucide-react";
import { WPPost, WPCategory } from "@/lib/types";
import { decodeHtml, toTitleCase } from "@/lib/utils";

interface FeaturedReviewProps {
  posts: WPPost[];
  categories: WPCategory[];
}

function getCategoryName(post: WPPost, categories: WPCategory[]): string {
  if (!post.categories?.length) return 'Product Reviews';
  const cat = categories.find((c) => c.id === post.categories[0]);
  return decodeHtml(toTitleCase(cat?.name || 'Product Reviews'));
}

function getPostRating(postId: number): number {
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9];
  return ratings[postId % ratings.length];
}

function getReadTime(excerpt: string): number {
  const words = excerpt.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(3, words * 6);
}

export default function FeaturedReview({ posts, categories }: FeaturedReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setProgressKey((k) => k + 1);
  };

  const nextSlide = () => goTo((currentIndex + 1) % posts.length);
  const prevSlide = () => goTo((currentIndex - 1 + posts.length) % posts.length);

  useEffect(() => {
    if (isPaused || posts.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, posts.length, currentIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex]);

  if (!posts.length) return null;

  const currentPost = posts[currentIndex];
  const media = currentPost._embedded?.['wp:featuredmedia']?.[0];
  const catName = getCategoryName(currentPost, categories);
  const rating = getPostRating(currentPost.id);
  const readTime = getReadTime(currentPost.excerpt.rendered);
  const cleanTitle = currentPost.title.rendered.replace(/<[^>]*>/g, '');
  const cleanExcerpt = currentPost.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 240);

  return (
    <section
      className="py-10 relative featured-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="block w-1 h-5 rounded-full bg-purple-600" />
            <h2 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-widest">Featured Reviews</h2>
          </div>
          <span className="text-xs text-purple-400 tabular-nums font-medium">
            {currentIndex + 1} / {posts.length}
          </span>
        </div>

        {/* Main card */}
        <div className="relative bg-white dark:bg-[#1a1035] rounded-2xl overflow-hidden shadow-xl border border-purple-200 dark:border-purple-900/50 border-t-4 border-t-purple-600">

          {/* Auto-progress bar */}
          {posts.length > 1 && (
            <div className="absolute top-0 left-0 right-0 z-30 h-[3px] bg-purple-100 dark:bg-purple-900/40">
              <div
                key={`${progressKey}-${isPaused}`}
                className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-full"
                style={
                  isPaused
                    ? { width: '0%' }
                    : { animation: 'featuredProgress 5s linear forwards' }
                }
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[460px]">

            {/* ── Image panel (3 / 5) ── */}
            <div className="relative lg:col-span-3 h-64 sm:h-80 lg:h-auto overflow-hidden">
              {media ? (
                <>
                  <Image
                    src={media.source_url}
                    alt={cleanTitle}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  {/* Fade to card bg on right edge (desktop) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/50 dark:from-[#1a1035]/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white dark:lg:to-[#1a1035]/80 pointer-events-none" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900 dark:via-purple-800/50 dark:to-[#1a1035]" />
              )}

              {/* Category + rating badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-md">
                  {catName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-gray-900 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  {rating}
                </span>
              </div>

              {/* Mobile nav arrows */}
              {posts.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2 lg:hidden z-10">
                  <button
                    onClick={prevSlide}
                    className="w-9 h-9 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center text-purple-700 dark:text-purple-400 hover:bg-white dark:hover:bg-gray-800 shadow transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-9 h-9 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center text-purple-700 dark:text-purple-400 hover:bg-white dark:hover:bg-gray-800 shadow transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* ── Content panel (2 / 5) ── */}
            <div className="lg:col-span-2 flex flex-col p-6 lg:p-8 lg:pl-6">

              {/* Desktop nav arrows */}
              {posts.length > 1 && (
                <div className="hidden lg:flex items-center gap-2 mb-5">
                  <button
                    onClick={prevSlide}
                    className="w-8 h-8 rounded-full border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-500 dark:text-purple-400 hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-8 h-8 rounded-full border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-500 dark:text-purple-400 hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="ml-auto text-xs text-purple-300 hidden xl:block">← → to navigate</span>
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(currentPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime} min read
                </span>
              </div>

              {/* Title */}
              <Link href={`/${currentPost.slug}`} className="group block mb-3">
                <h2
                  className="text-xl lg:text-[1.35rem] font-bold text-gray-900 dark:text-white leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-3"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {cleanTitle}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-5 flex-1">
                {cleanExcerpt}
              </p>

              {/* Star rating row */}
              <div className="flex items-center gap-2 mb-5 pb-5 border-b border-purple-100 dark:border-purple-900/40">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;
                    const isFull = i <= Math.floor(rating);
                    return isHalf ? (
                      <span key={i} className="relative inline-block w-3.5 h-3.5">
                        <Star className="w-3.5 h-3.5 fill-gray-200 text-gray-200" />
                        <span className="absolute inset-0 overflow-hidden w-1/2">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </span>
                      </span>
                    ) : (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${isFull ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`}
                      />
                    );
                  })}
                </div>
                <span className="text-sm font-bold text-amber-500">{rating}</span>
                <span className="text-xs text-gray-400">/ 5 · Verified</span>
              </div>

              {/* CTA */}
              <Link
                href={`/${currentPost.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 text-white text-sm font-semibold hover:from-purple-600 hover:to-purple-500 transition-all duration-200 shadow-md shadow-purple-200 dark:shadow-purple-900/50 hover:shadow-purple-300 dark:hover:shadow-purple-800/60 hover:-translate-y-0.5 self-start"
              >
                Read Full Review
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Thumbnail strip */}
              {posts.length > 1 && (
                <div className="mt-auto pt-5">
                  <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-2.5">More Reviews</p>
                  <div className="flex gap-2">
                    {posts.map((post, idx) => {
                      const thumb = post._embedded?.['wp:featuredmedia']?.[0];
                      const isActive = idx === currentIndex;
                      return (
                        <button
                          key={post.id}
                          onClick={() => goTo(idx)}
                          aria-label={`View: ${post.title.rendered.replace(/<[^>]*>/g, '')}`}
                          className={`relative flex-1 h-12 rounded-lg overflow-hidden transition-all duration-300 ring-2 ${
                            isActive
                              ? 'ring-purple-500 opacity-100 scale-100'
                              : 'ring-transparent opacity-50 hover:opacity-80 hover:ring-purple-200 scale-95 hover:scale-100'
                          }`}
                        >
                          {thumb ? (
                            <Image
                              src={thumb.source_url}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full bg-purple-100 dark:bg-purple-900/50" />
                          )}
                          {isActive && (
                            <div className="absolute inset-0 ring-inset ring-2 ring-purple-500/50 rounded-lg" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
