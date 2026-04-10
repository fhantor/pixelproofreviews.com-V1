'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Search, Sparkles, Bell } from 'lucide-react';
import { WPPost } from '@/lib/types';
import { useState } from 'react';

interface PostSidebarProps {
  recentPosts: WPPost[];
}

export default function PostSidebar({ recentPosts }: PostSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <aside className="space-y-6">
      {/* Search Box */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-dark-100 dark:border-dark-800 p-5">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-dark-100 placeholder:text-dark-400 dark:placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          </div>
        </form>
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-dark-100 dark:border-dark-800 p-5">
        <h3 className="font-semibold text-dark-900 dark:text-white mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.slice(0, 5).map((post) => {
            const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
            return (
              <Link key={post.id} href={`/${post.slug}`} className="flex gap-3 group">
                {featuredMedia && (
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-dark-50 dark:bg-dark-800">
                    <Image
                      src={featuredMedia.source_url}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-dark-800 dark:text-dark-200 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {post.title.rendered.replace(/<[^>]*>/g, '')}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-xs text-dark-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="relative rounded-xl border border-purple-200 dark:border-purple-800/50 bg-white dark:bg-dark-900 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-600/10 dark:bg-purple-500/10 blur-2xl pointer-events-none" />
        <div className="relative p-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3 tracking-wide uppercase">
            <Sparkles className="w-3 h-3" />
            Weekly Newsletter
          </div>
          <h3 className="text-base font-bold leading-snug mb-1 text-dark-900 dark:text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Stay Ahead of the Curve
          </h3>
          <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed mb-4">
            Honest reviews, exclusive deals, and expert tips — every Thursday. No spam, ever.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {['F', 'A', 'M', 'R'].map((l, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-700/60 border-2 border-white dark:border-dark-900 flex items-center justify-center text-[9px] font-bold text-purple-700 dark:text-purple-200">
                  {l}
                </div>
              ))}
            </div>
            <span className="text-xs text-dark-500 dark:text-dark-400">
              <span className="font-semibold text-dark-800 dark:text-white">5,000+</span> readers joined
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              disabled
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white dark:bg-dark-800 border border-purple-200 dark:border-purple-800/50 text-dark-900 dark:text-dark-100 placeholder:text-dark-400 text-sm focus:outline-none cursor-not-allowed opacity-75"
            />
            <button
              disabled
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 dark:bg-purple-500 text-white font-semibold text-sm cursor-not-allowed opacity-60"
            >
              <Bell className="w-3.5 h-3.5" />
              Subscribe
            </button>
          </div>
          <p className="text-[11px] text-dark-400 dark:text-dark-500 mt-2 text-center">
            Coming soon · Unsubscribe anytime
          </p>
        </div>
      </div>
    </aside>
  );
}
