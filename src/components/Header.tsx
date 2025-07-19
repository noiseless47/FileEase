"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IconArchive, IconSun, IconMoon, IconBrandGithub, IconMenu2, IconX, IconFileZip } from '@tabler/icons-react';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Only run on client side
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!mounted) return null;

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 shadow-md' 
        : 'bg-white/80 dark:bg-gray-900/80 shadow-sm'
    } border-b border-gray-200 dark:border-gray-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-violet-600 text-white">
                <IconArchive className="w-6 h-6 transition-transform group-hover:scale-110" />
              </div>
              <span className="font-display text-xl font-semibold tracking-tight">
                File<span className="text-pink-600 dark:text-pink-400">Ease</span>
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/features" 
              className="font-medium text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/compression" 
              className="font-medium text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 transition-colors"
            >
              Compression
            </Link>
            <Link 
              href="/pricing" 
              className="font-medium text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className="font-medium text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <IconSun className="h-5 w-5 text-yellow-400" />
              ) : (
                <IconMoon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            <a 
              href="https://github.com/username/fileease"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="GitHub repository"
            >
              <IconBrandGithub className="h-5 w-5" />
            </a>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconMenu2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            <Link 
              href="/features" 
              className="block py-2 px-3 rounded-md font-medium text-gray-600 hover:text-pink-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-pink-400 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/compression" 
              className="block py-2 px-3 rounded-md font-medium text-gray-600 hover:text-pink-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-pink-400 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Compression
            </Link>
            <Link 
              href="/pricing" 
              className="block py-2 px-3 rounded-md font-medium text-gray-600 hover:text-pink-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-pink-400 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className="block py-2 px-3 rounded-md font-medium text-gray-600 hover:text-pink-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-pink-400 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 