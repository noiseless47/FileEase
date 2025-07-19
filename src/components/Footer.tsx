"use client";

import Link from 'next/link';
import { IconBrandTwitter, IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconArchive } from '@tabler/icons-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-violet-600 text-white">
                <IconArchive className="w-6 h-6" />
              </div>
              <span className="font-display text-xl font-semibold tracking-tight">
                File<span className="text-pink-600 dark:text-pink-400">Ease</span>
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs">
              Simple, fast, and secure file utilities that respect your privacy. All processing happens in your browser.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" 
                aria-label="Twitter"
              >
                <IconBrandTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" 
                aria-label="Facebook"
              >
                <IconBrandFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" 
                aria-label="Instagram"
              >
                <IconBrandInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors" 
                aria-label="LinkedIn"
              >
                <IconBrandLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product column */}
          <div>
            <h3 className="font-display font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="footer-link">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="footer-link">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="footer-link">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="footer-link">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="font-display font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="footer-link">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/docs" className="footer-link">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="footer-link">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="font-display font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="footer-link">
                  About
                </Link>
              </li>
              <li>
                <Link href="/team" className="footer-link">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="footer-link">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} FileEase. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <Link href="/privacy" className="footer-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="footer-link">
              Terms of Service
            </Link>
            <Link href="/cookies" className="footer-link">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 