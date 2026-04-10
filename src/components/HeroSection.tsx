import Link from "next/link";
import { Shield, Users, Award, Star, ArrowRight, TrendingUp } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zm40 0h-1v40h1zM0 0v1h40V0zm0 40v-1h40v1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-7">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-white/10 text-purple-100 border border-white/20 gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Expert In-Depth Analysis
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Honest Reviews for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                Digital Tools
              </span>
            </h1>

            <p className="text-lg text-purple-100 leading-relaxed max-w-2xl mx-auto">
              Expert insights on software, themes, plugins, and marketing tools —
              backed by real-world testing and 12+ years of digital marketing experience.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/#posts-section"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-purple-700 font-semibold text-sm shadow-lg hover:shadow-xl hover:bg-purple-50 transition-all duration-200 hover:-translate-y-0.5"
              >
                Browse All Reviews
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/category/product-reviews"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                <TrendingUp className="w-4 h-4" />
                Top Picks
              </Link>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-100">Unbiased Reviews</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-100">Expert Team of 4</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-100">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip — visual break between hero and carousel */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 text-center py-5">
            <div className="px-4">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">5,000+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Readers Helped</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">4.8 ★</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Avg. Review Score</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">12 yrs</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">In Digital Marketing</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
