"use client";

import { useState } from 'react';
import CompressFiles from '@/components/CompressFiles';
import { 
  IconArchive, 
  IconArrowRight, 
  IconDeviceLaptop, 
  IconLock, 
  IconRocket,
  IconFileZip,
  IconFileCheck,
  IconChartBar,
  IconChevronDown,
  IconQuestionMark
} from '@tabler/icons-react';

export default function CompressionPage() {
  const [activeTab, setActiveTab] = useState('compress');
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);

  const toggleFaq = (id: string) => {
    setOpenFaqs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const faqs = [
    {
      id: 'how-works',
      question: 'How does file compression work?',
      answer: (
        <div className="space-y-4">
          <p>
            File compression reduces the size of files by identifying and eliminating redundant data. This makes files smaller while preserving the original information, making them easier to store and share.
          </p>
          <div className="space-y-6 mt-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The compression algorithm analyzes your files to identify patterns and redundancies that can be represented more efficiently.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Encoding</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data is encoded using various techniques like dictionary coding, Huffman coding, or run-length encoding to create a more compact representation.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Archiving</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Multiple compressed files are bundled together into a single archive file (like ZIP) for easy management and sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'benefits-storage',
      question: 'What are the benefits of compression for storage?',
      answer: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Save valuable disk space on your devices</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Reduce cloud storage costs by storing compressed files</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Organize related files together in a single archive</span>
          </li>
        </ul>
      )
    },
    {
      id: 'benefits-sharing',
      question: 'How does compression help with file sharing?',
      answer: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Faster upload and download times for sharing</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Easier to share multiple files as a single attachment</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Bypass email attachment size limits with smaller files</span>
          </li>
        </ul>
      )
    },
    {
      id: 'best-practices',
      question: 'What are the best practices for compression?',
      answer: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Group similar file types together for better compression</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Use higher compression levels for long-term storage</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Consider file types when compressing - text compresses better than media</span>
          </li>
        </ul>
      )
    },
    {
      id: 'when-to-use',
      question: 'When should I use compression?',
      answer: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Before uploading large files to cloud storage</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">When sending multiple files via email</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">For archiving files you don't access frequently</span>
          </li>
        </ul>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black py-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 -mt-10 -mr-20 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-3xl"></div>
            <div className="absolute left-0 bottom-0 -mb-10 -ml-20 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center animate-fade-in">
              <span className="inline-block px-4 py-2 rounded-full bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 font-medium text-sm mb-6">
                Powerful File Compression
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                Compress Your Files with <span className="gradient-text">Ease</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Reduce file sizes while maintaining quality. Perfect for sharing, storing, and optimizing your digital assets.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-8 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-10">
              <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setActiveTab('compress')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'compress'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconFileZip className="w-4 h-4 mr-2" />
                  Compress Files
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'about'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconFileCheck className="w-4 h-4 mr-2" />
                  About Compression
                </button>
              </div>
            </div>

            {activeTab === 'compress' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white">
                      <IconArchive size={24} stroke={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">Compress Files</h2>
                      <p className="text-gray-600 dark:text-gray-400">Drag and drop files to compress them into a ZIP archive</p>
                    </div>
                  </div>
                  
                  <CompressFiles />
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white">
                      <IconFileCheck size={24} stroke={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">About File Compression</h2>
                      <p className="text-gray-600 dark:text-gray-400">Learn more about how file compression works and its benefits</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                      File compression is the process of reducing the size of files to save storage space and make them easier to transfer. Our file compression tool helps you quickly and securely compress your files directly in your web browser.
                    </p>
                    
                    <p className="mt-4">
                      Whether you need to email large files, save storage space, or simply organize your files better, our compression tool provides a fast and convenient solution.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                  <IconLock size={20} stroke={1.5} />
                </div>
                <h3 className="font-medium mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All processing happens in your browser. Files never leave your device.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                  <IconRocket size={20} stroke={1.5} />
                </div>
                <h3 className="font-medium mb-1">Fast Processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimized algorithms ensure quick compression of your files.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                  <IconDeviceLaptop size={20} stroke={1.5} />
                </div>
                <h3 className="font-medium mb-1">No Installation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Works directly in your browser. No software to download or install.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Learn more about file compression and how our tool can help you manage your files more efficiently.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map(faq => (
                <div 
                  key={faq.id} 
                  className="bg-white dark:bg-gray-800/50 rounded-lg overflow-hidden shadow-sm"
                >
                  <button 
                    className="flex justify-between items-center w-full p-5 text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={openFaqs.includes(faq.id)}
                  >
                    <div className="flex items-center">
                      <IconQuestionMark 
                        className="w-5 h-5 text-pink-500 mr-3 shrink-0" 
                        size={18} 
                      />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{faq.question}</span>
                    </div>
                    <IconChevronDown 
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${openFaqs.includes(faq.id) ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaqs.includes(faq.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-gray-600 dark:text-gray-300 mt-2">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 