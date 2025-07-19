"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  IconArchive, 
  IconSun, 
  IconMoon, 
  IconBrandGithub, 
  IconMenu2, 
  IconX, 
  IconFileZip, 
  IconChevronDown,
  IconFile,
  IconTools,
  IconFileText,
  IconArrowsShuffle,
  IconEye,
  IconLock,
  IconScan
} from '@tabler/icons-react';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Only run on client side
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
  };

  if (!mounted) return null;

  const toolsCategories = [
    {
      title: "Compress",
      items: [
        { name: "Compress PDF", path: "/compression", icon: <IconFile className="w-5 h-5 text-red-500" /> },
      ]
    },
    {
      title: "Organize",
      items: [
        { name: "Merge PDF", path: "/features", icon: <IconArrowsShuffle className="w-5 h-5 text-purple-500" /> },
        { name: "Split PDF", path: "/features", icon: <IconFileText className="w-5 h-5 text-purple-500" /> },
        { name: "Zip Files", path: "/zip-unzip?tab=zip", icon: <IconFileZip className="w-5 h-5 text-purple-500" /> },
        { name: "Unzip Files", path: "/zip-unzip?tab=unzip", icon: <IconArchive className="w-5 h-5 text-purple-500" /> },
      ]
    },
    {
      title: "View & Edit",
      items: [
        { name: "PDF Viewer", path: "/features", icon: <IconEye className="w-5 h-5 text-teal-500" /> },
      ]
    },
    {
      title: "Security",
      items: [
        { name: "Secure Files", path: "/features", icon: <IconLock className="w-5 h-5 text-pink-500" /> },
      ]
    },
    {
      title: "Scan",
      items: [
        { name: "Document Scanner", path: "/features", icon: <IconScan className="w-5 h-5 text-blue-500" /> },
      ]
    }
  ];

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
            {/* Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={toggleToolsDropdown}
                className="flex items-center font-medium text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 transition-colors"
              >
                <IconTools className="w-4 h-4 mr-1" />
                <span>All Tools</span>
                <IconChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isToolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-[600px] bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 grid grid-cols-3 gap-6">
                    {toolsCategories.map((category) => (
                      <div key={category.title}>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                          {category.title}
                        </h3>
                        <ul className="space-y-2">
                          {category.items.map((item) => (
                            <li key={item.name}>
                              <Link 
                                href={item.path}
                                onClick={() => setIsToolsDropdownOpen(false)}
                                className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <span className="mr-2">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
              Compress
            </Link>
            <Link 
              href="/zip-unzip" 
              className="font-medium text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 transition-colors"
            >
              <div className="flex items-center">
                <IconFileZip className="w-4 h-4 mr-1" />
                <span>Zip/Unzip</span>
              </div>
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
            <div className="py-2">
              <button 
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center w-full py-2 px-3 rounded-md font-medium text-gray-600 hover:text-pink-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-pink-400 dark:hover:bg-gray-800 transition-colors"
              >
                <IconTools className="w-4 h-4 mr-2" />
                All Tools
                <IconChevronDown className={`ml-auto w-4 h-4 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isToolsDropdownOpen && (
                <div className="mt-2 pl-5 space-y-4">
                  {toolsCategories.map((category) => (
                    <div key={category.title} className="space-y-1">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 py-1">
                        {category.title}
                      </h3>
                      {category.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          className="flex items-center py-1 px-3 rounded-md text-gray-600 hover:text-pink-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-pink-400 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="mr-2">{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              href="/zip-unzip" 
              className="flex items-center py-2 px-3 rounded-md font-medium text-gray-600 hover:text-pink-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-pink-400 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <IconFileZip className="w-4 h-4 mr-2" />
              Zip/Unzip
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