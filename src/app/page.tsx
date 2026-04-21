import { getPosts, getCategories } from '@/lib/wordpress';
import type { Metadata } from 'next';
import type { WPPost, WPCategory, PaginationInfo } from '@/lib/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedReview from '@/components/FeaturedReview';
import PostGrid from '@/components/PostGrid';
import Sidebar from '@/components/Sidebar';

const SITE_URL = 'https://www.pixelproofreviews.com';

export const metadata: Metadata = {
  title: 'Pixel Proof Reviews — Honest Digital Product Reviews',
  description: 'In-depth reviews of digital tools, software, themes, plugins, and marketing solutions — backed by real-world testing and 12+ years of digital marketing expertise.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: 'Pixel Proof Reviews — Honest Digital Product Reviews',
    description: 'In-depth reviews of digital tools, software, themes, plugins, and marketing solutions — backed by real-world testing and 12+ years of digital marketing expertise.',
    type: 'website',
    images: [{
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Pixel Proof Reviews',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pixel Proof Reviews — Honest Digital Product Reviews',
    description: 'In-depth reviews of digital tools, software, themes, plugins, and marketing solutions — backed by real-world testing and 12+ years of digital marketing expertise.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const POSTS_PER_PAGE = 10;
const CAROUSEL_POSTS = 5;

export default async function Home() {
  let posts: WPPost[] = [];
  let pagination: PaginationInfo = { currentPage: 1, totalPages: 1, totalPosts: 0 };
  let categories: WPCategory[] = [];

  try {
    const result = await getPosts(1);
    posts = result.posts;
    pagination = result.pagination;
  } catch {
    // WordPress API temporarily unavailable — render page without posts
  }

  try {
    categories = await getCategories();
  } catch {
    // WordPress API temporarily unavailable — render page without categories
  }

  return (
    <div className="min-h-screen bg-background">
      <Header categories={categories} />
      
      <main>
        <HeroSection />
        
        {posts.length > 0 && (
          <FeaturedReview posts={posts.slice(0, CAROUSEL_POSTS)} categories={categories} />
        )}
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PostGrid
                posts={posts.slice(0, POSTS_PER_PAGE)}
                categories={categories}
                currentPage={1}
                totalPages={pagination.totalPages}
              />
            </div>
            
            <div className="lg:col-span-1">
              <Sidebar categories={categories} recentPosts={posts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
