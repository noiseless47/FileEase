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
  IconChartBar
} from '@tabler/icons-react';

export default function CompressionPage() {
  const [activeTab, setActiveTab] = useState('compress');

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
        <section className="py-12 bg-white dark:bg-black">
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
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
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
                  
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                        <IconLock size={20} stroke={1.5} />
                      </div>
                      <h3 className="font-medium mb-1">Secure & Private</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        All processing happens in your browser. Files never leave your device.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                        <IconRocket size={20} stroke={1.5} />
                      </div>
                      <h3 className="font-medium mb-1">Fast Processing</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Optimized algorithms ensure quick compression of your files.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
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
              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-display font-bold mb-4">How File Compression Works</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    File compression reduces the size of files by identifying and eliminating redundant data. This makes files smaller while preserving the original information, making them easier to store and share.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                        <span className="font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Analysis</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          The compression algorithm analyzes your files to identify patterns and redundancies that can be represented more efficiently.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                        <span className="font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Encoding</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Data is encoded using various techniques like dictionary coding, Huffman coding, or run-length encoding to create a more compact representation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                        <span className="font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Archiving</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Multiple compressed files are bundled together into a single archive file (like ZIP) for easy management and sharing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white">
                      <IconChartBar size={20} stroke={1.5} />
                    </div>
                    <h2 className="text-2xl font-display font-bold">Compression Benefits</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">For Storage</h3>
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
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">For Sharing</h3>
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
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-pink-600 to-violet-600 rounded-xl shadow-sm p-6 text-white">
                  <h2 className="text-2xl font-display font-bold mb-4">Compression Tips</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Best Practices</h3>
                      <ul className="space-y-2 text-white/90">
                        <li className="flex items-start gap-2">
                          <IconArrowRight className="w-4 h-4 mt-1 shrink-0" />
                          <span>Group similar file types together for better compression</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <IconArrowRight className="w-4 h-4 mt-1 shrink-0" />
                          <span>Use higher compression levels for long-term storage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <IconArrowRight className="w-4 h-4 mt-1 shrink-0" />
                          <span>Consider file types when compressing - text compresses better than media</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">When to Use Compression</h3>
                      <ul className="space-y-2 text-white/90">
                        <li className="flex items-start gap-2">
                          <IconArrowRight className="w-4 h-4 mt-1 shrink-0" />
                          <span>Before uploading large files to cloud storage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <IconArrowRight className="w-4 h-4 mt-1 shrink-0" />
                          <span>When sending multiple files via email</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <IconArrowRight className="w-4 h-4 mt-1 shrink-0" />
                          <span>For archiving projects or backups</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Everything you need to know about our file compression tool
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-lg mb-3">What file types can I compress?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You can compress any file type. However, some files like images, videos, and PDFs may already be compressed and might not reduce much further in size.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-lg mb-3">Is there a file size limit?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The tool works best with files up to 500MB total. Larger files may take longer to process and depend on your device's capabilities.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-lg mb-3">Are my files secure?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! All processing happens directly in your browser. Your files never leave your device or get uploaded to our servers.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-lg mb-3">What compression algorithm is used?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We use industry-standard DEFLATE algorithm with zlib implementation, which provides an excellent balance between compression ratio and speed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 