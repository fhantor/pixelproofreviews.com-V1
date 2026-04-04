"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WPPost, WPCategory } from "@/lib/types";
import { decodeHtml, toTitleCase } from "@/lib/utils";

function mapCategoryName(name: string): string {
  if (name === 'Product Reviews') return 'All Reviews';
  return name;
}

interface SidebarProps {
  categories: WPCategory[];
  recentPosts: WPPost[];
}

export default function Sidebar({ categories, recentPosts }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <aside className="space-y-6">
      {/* Search Box */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-primary" />
            Search Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for tools, software..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-base"
            >
              Search
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 w-fit text-sm">
                {toTitleCase(decodeHtml(mapCategoryName(cat.name)))}
                <span className="ml-1 text-xs opacity-60">({cat.count})</span>
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {recentPosts.length === 0 ? (
            <p className="text-muted-foreground text-base">No recent posts available</p>
          ) : (
            recentPosts.slice(0, 5).map((post) => {
              const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
              return (
                <Link key={post.id} href={`/${post.slug}`} className="group block">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-md flex-shrink-0 overflow-hidden bg-secondary">
                      {featuredMedia ? (
                        <Image
                          src={featuredMedia.source_url}
                          alt=""
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">IMG</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title.rendered.replace(/<[^>]*>/g, '')}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
