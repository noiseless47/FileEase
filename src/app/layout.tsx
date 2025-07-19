import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';
import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dmSans } from './fonts';

export const metadata: Metadata = {
  title: "FileEase - Simple File Utilities",
  description: "A beautiful and simple tool for file compression and management",
  keywords: ["file compression", "file management", "zip files", "file utility"],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <>
            <Background />
            <Header />
            <main className="min-h-screen selection:bg-pink-500/20 selection:text-pink-800 dark:selection:bg-pink-500/30 dark:selection:text-pink-200">
              {children}
            </main>
            <Footer />
          </>
        </ThemeProvider>
      </body>
    </html>
  );
}
