'use client';

import { useTheme } from '@/context/ThemeContext';

export default function Background() {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900">
      {/* Light mode simple gradient */}
      {theme === 'light' && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white to-gray-100"
          aria-hidden="true"
        />
      )}
      
      {/* Dark mode simple gradient */}
      {theme === 'dark' && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"
          aria-hidden="true"
        />
      )}
    </div>
  );
} 