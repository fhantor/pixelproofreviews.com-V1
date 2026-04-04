import Link from "next/link";
import Image from "next/image";
import { Star, Calendar, ArrowRight, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WPPost, WPCategory } from "@/lib/types";
import { decodeHtml, toTitleCase } from "@/lib/utils";

interface PostCardProps {
  post: WPPost;
  categories?: WPCategory[];
}

function getCategoryName(post: WPPost, categories?: WPCategory[]): string {
  if (!categories || !post.categories?.length) return 'Product Reviews';
  const cat = categories.find((c) => c.id === post.categories[0]);
  return toTitleCase(decodeHtml(cat?.name || 'Product Reviews'));
}

function getCategorySlug(post: WPPost, categories?: WPCategory[]): string {
  if (!categories || !post.categories?.length) return 'product-reviews';
  const cat = categories.find((c) => c.id === post.categories[0]);
  return cat?.slug || 'product-reviews';
}

function getExcerpt(rendered: string): string {
  const plain = decodeHtml(rendered.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
  return plain.length > 200 ? plain.slice(0, 200).trimEnd() + '…' : plain;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const isHalf = index === 4 && rating >= 4.5;
    return (
      <div key={index} className="relative h-4 w-4">
        <Star className="h-4 w-4 text-gray-300 absolute" />
        <Star
          className={`h-4 w-4 ${
            index < Math.floor(rating) || isHalf
              ? "fill-orange-400 text-orange-400"
              : "text-gray-300"
          }`}
          style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
        />
      </div>
    );
  });
}

function getPostRating(postId: number): number {
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9];
  return ratings[postId % ratings.length];
}

export default function PostCard({ post, categories }: PostCardProps) {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const imageUrl = featuredMedia?.source_url;
  const catName = getCategoryName(post, categories);
  const rating = getPostRating(post.id);

  return (
    <Card className="group hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer">
      <Link href={`/${post.slug}`} className="block">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 p-3 sm:p-5">
          {/* Featured Image - Big on Left */}
          <div className="relative overflow-hidden rounded-lg flex-shrink-0 w-full sm:w-60 h-40 sm:h-44">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''))}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 288px"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-secondary text-muted-foreground">
                <Monitor className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Content on Right */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary dark:bg-amber-400 text-primary-foreground dark:text-gray-900 font-medium text-xs">
                {catName}
              </Badge>
              <div className="flex items-center gap-1">
                {renderStars(rating)}
              </div>
              <span className="text-xs text-muted-foreground">{rating}/5.0</span>
            </div>
            
            <h3 className="text-lg font-semibold line-clamp-2 text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
              {decodeHtml(post.title.rendered.replace(/<[^>]*>/g, ''))}
            </h3>
            
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-3">
              {getExcerpt(post.excerpt.rendered)}
            </p>
            
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.date)}</span>
                </div>
              </div>
              
              <Button 
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium"
              >
                Read Review
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
