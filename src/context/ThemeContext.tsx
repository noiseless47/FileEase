'use client';

import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create context with default values to avoid initialization errors
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme once on the client side
  useEffect(() => {
    setMounted(true);
    
    // Check local storage
    let savedTheme: Theme | null = null;
    try {
      savedTheme = localStorage.getItem('theme') as Theme | null;
    } catch (error) {
      // Handle localStorage being unavailable
      console.warn('LocalStorage not available:', error);
    }
    
    // Check system preference if no saved theme
    if (!savedTheme) {
      try {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        return;
      } catch (error) {
        console.warn('Media query not available:', error);
      }
    } else {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Apply theme change with a small delay to prevent flashes
  const updateDomTheme = useCallback((newTheme: Theme) => {
    setTimeout(() => {
      try {
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      } catch (error) {
        console.warn('Could not update theme classes:', error);
      }
    }, 50);
  }, []);

  // Safe theme toggle that works on client side
  const toggleTheme = () => {
    if (!mounted) return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      localStorage.setItem('theme', newTheme);
      updateDomTheme(newTheme);
    } catch (error) {
      console.warn('Could not save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Safe hook that works with SSR
export function useTheme() {
  return useContext(ThemeContext);
} 