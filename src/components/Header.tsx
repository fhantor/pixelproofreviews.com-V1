'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X, Diamond, Sun, Moon } from "lucide-react";
import { WPCategory } from "@/lib/types";
import { decodeHtml, toTitleCase } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

function mapCategoryName(name: string): string {
  if (name === 'Product Reviews') return 'All Reviews';
  return name;
}

interface HeaderProps {
  categories?: WPCategory[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 shadow-xl relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 cursor-pointer">
                  <Diamond className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white hover:text-purple-100 transition-colors duration-200 tracking-tight drop-shadow-sm" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  Pixel<span className="text-purple-300">Proof</span> Reviews
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button variant="ghost" className={`text-white font-medium hover:bg-white/10 ${isActive('/') ? 'bg-white/15 underline underline-offset-4 decoration-purple-300' : ''}`}>
                  Home
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white font-medium hover:bg-white/10 normal-case">
                    Product Reviews
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50 mt-2">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link href={`/category/${category.slug}`} className="text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer px-3 py-2">
                        {toTitleCase(mapCategoryName(decodeHtml(category.name)))}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/blog">
                <Button variant="ghost" className={`text-white font-medium hover:bg-white/10 ${isActive('/blog') ? 'bg-white/15 underline underline-offset-4 decoration-purple-300' : ''}`}>
                  Blog
                </Button>
              </Link>

              <Link href="/contact-me">
                <Button variant="ghost" className={`text-white font-medium hover:bg-white/10 ${isActive('/contact-me') ? 'bg-white/15 underline underline-offset-4 decoration-purple-300' : ''}`}>
                  Contact Me
                </Button>
              </Link>

              {/* Dark mode toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-white hover:bg-white/10 ml-2"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </nav>

            {/* Mobile right side: dark toggle + hamburger */}
            <div className="md:hidden flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-white hover:bg-white/10"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Outside the purple header */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col space-y-2">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start text-dark-800 dark:text-dark-200 hover:bg-purple-50 dark:hover:bg-dark-800" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Button>
              </Link>

              <div className="space-y-1">
                <div className="text-dark-600 dark:text-dark-400 font-medium px-3 py-2 text-sm tracking-wide">Product Reviews</div>
                <div className="pl-4 space-y-1">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/category/${category.slug}`}>
                      <Button variant="ghost" className="w-full justify-start text-dark-700 dark:text-dark-300 text-sm hover:bg-purple-50 dark:hover:bg-dark-800" onClick={() => setIsMenuOpen(false)}>
                      {toTitleCase(mapCategoryName(decodeHtml(category.name)))}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/blog">
                <Button variant="ghost" className="w-full justify-start text-dark-800 dark:text-dark-200 hover:bg-purple-50 dark:hover:bg-dark-800" onClick={() => setIsMenuOpen(false)}>
                  Blog
                </Button>
              </Link>

              <Link href="/contact-me">
                <Button variant="ghost" className="w-full justify-start text-dark-800 dark:text-dark-200 hover:bg-purple-50 dark:hover:bg-dark-800" onClick={() => setIsMenuOpen(false)}>
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
