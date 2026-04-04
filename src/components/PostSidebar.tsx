'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Search } from 'lucide-react';
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
    <aside className="space-y-6 lg:sticky lg:top-24">
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
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-5 text-white">
        <h3 className="font-semibold text-lg mb-2">Join 5,000+ Readers</h3>
        <p className="text-purple-100 text-sm mb-3">
          Get the latest reviews, exclusive deals, and expert tips delivered to your inbox.
        </p>
        <p className="text-xs text-purple-200 italic">Newsletter form coming soon</p>
      </div>
    </aside>
  );
}
