"use client";

import { useState, useEffect } from 'react';
import ZipUnzip from '@/components/ZipUnzip';
import { 
  IconZip,
  IconFileZip, 
  IconArchive, 
  IconArrowRight, 
  IconDeviceLaptop, 
  IconLock, 
  IconRocket,
  IconFileCheck,
  IconChevronDown,
  IconQuestionMark
} from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';

export default function ZipUnzipPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('zip');
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);

  useEffect(() => {
    if (tabParam === 'zip' || tabParam === 'unzip' || tabParam === 'about') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const toggleFaq = (id: string) => {
    setOpenFaqs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const faqs = [
    {
      id: 'what-is-zip',
      question: 'What is a ZIP archive?',
      answer: (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ZIP is a widely used archive file format that supports lossless data compression. ZIP files can contain one or more files or directories that are compressed individually, allowing you to efficiently store and transfer multiple files together.
          </p>
        </div>
      )
    },
    {
      id: 'space-saving',
      question: 'How does ZIP compression save space?',
      answer: (
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
            <span className="font-bold">1</span>
          </div>
          <div>
            <h4 className="font-medium mb-1">Space Saving</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ZIP compression can reduce file sizes significantly, especially for text files, making storage and transfer more efficient.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'organization',
      question: 'How do ZIP archives help with file organization?',
      answer: (
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
            <span className="font-bold">2</span>
          </div>
          <div>
            <h4 className="font-medium mb-1">Organization</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ZIP archives allow you to group multiple files together, maintaining directory structures, making it easier to share related files.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'universal-support',
      question: 'Which platforms support ZIP files?',
      answer: (
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
            <span className="font-bold">3</span>
          </div>
          <div>
            <h4 className="font-medium mb-1">Universal Support</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ZIP format is supported on virtually all operating systems and devices, making it a reliable choice for file sharing.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'when-to-use',
      question: 'When should I use ZIP compression?',
      answer: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">When sending multiple files via email</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">To reduce storage usage for rarely accessed files</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">For organizing related files into a single package</span>
          </li>
        </ul>
      )
    },
    {
      id: 'compression-levels',
      question: 'How do I choose the right compression level?',
      answer: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Use faster compression for temporary archives</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Use maximum compression for long-term storage</span>
          </li>
          <li className="flex items-start gap-2">
            <IconArrowRight className="w-4 h-4 mt-1 text-pink-600 dark:text-pink-400 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400">Text files compress better than images or videos</span>
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
                Create & Extract Archives
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                ZIP & UNZIP Files with <span className="gradient-text">Ease</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Create compressed archives to save space or extract files from ZIP archives quickly and securely.
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
                  onClick={() => setActiveTab('zip')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'zip'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconZip className="w-4 h-4 mr-2" />
                  Zip Files
                </button>
                <button
                  onClick={() => setActiveTab('unzip')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'unzip'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconFileZip className="w-4 h-4 mr-2" />
                  Unzip Files
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
                  About
                </button>
              </div>
            </div>

            {(activeTab === 'zip' || activeTab === 'unzip') && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white">
                      <IconArchive size={24} stroke={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">
                        {activeTab === 'zip' ? 'Zip Files' : 'Unzip Files'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {activeTab === 'zip' 
                          ? 'Compress multiple files into a single ZIP archive'
                          : 'Extract files from a ZIP archive'}
                      </p>
                    </div>
                  </div>
                  
                  <ZipUnzip initialMode={(activeTab === 'zip' || activeTab === 'unzip') ? activeTab : 'zip'} />
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
                      <h2 className="text-2xl font-display font-bold">About ZIP Archives</h2>
                      <p className="text-gray-600 dark:text-gray-400">Learn more about ZIP files and how they can help you</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                      ZIP archives are a widely used file format that allows multiple files to be packaged together and compressed to reduce their overall size. This makes them ideal for storing and sharing collections of files efficiently.
                    </p>
                    
                    <p className="mt-4">
                      With our ZIP/UNZIP tool, you can easily create new ZIP archives from your files or extract the contents of existing ZIP files directly in your web browser.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">Key Benefits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconLock size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Secure & Private</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your files are processed securely on our servers with no data retention.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconRocket size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Fast Processing</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Optimized algorithms ensure quick compression and extraction of your files.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconDeviceLaptop size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Web-Based</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No software installation required. Access from any modern browser.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Learn more about ZIP files and how our tool can help you manage your files more efficiently.
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