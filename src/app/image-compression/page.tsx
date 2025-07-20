"use client";

import { useState, useEffect } from "react";
import CompressImages from "@/components/CompressImages";
import { 
  IconPhoto,
  IconInfoCircle, 
  IconLock,
  IconDeviceLaptop,
  IconRocket,
  IconFileCheck,
  IconQuestionMark,
  IconChevronDown
} from "@tabler/icons-react";

export default function ImageCompressionPage() {
  const [activeTab, setActiveTab] = useState<'compress' | 'about'>('compress');
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);
  
  // Handle URL parameters for direct tab access
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');
    if (tab === 'about') {
      setActiveTab('about');
    }
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // FAQ items
  const faqItems = [
    { 
      id: 'how-works',
      question: "How does image compression work?", 
      answer: (
        <div className="space-y-4">
          <p>
            Image compression reduces file size by analyzing image data and removing redundancies while preserving visual quality. This makes images smaller for efficient storage and sharing.
          </p>
          <div className="space-y-6 mt-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The compression algorithm analyzes the image to identify color patterns, redundancies, and areas where data can be optimized.
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
                  Using format-specific techniques like chroma subsampling, DCT transformation, or quantization to represent the image data more efficiently.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Optimization</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Final optimizations are applied based on the selected compression level to balance between file size and visual quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'formats',
      question: "What image formats are supported?", 
      answer: "The tool currently supports JPEG, PNG, and WebP formats. Different compression techniques are applied to each format to ensure optimal results. JPEG is best for photographs, PNG for images with transparency, and WebP offers a good balance of quality and compression for web use."
    },
    { 
      id: 'quality',
      question: "Will compressing my images affect their quality?", 
      answer: "Yes, but to varying degrees depending on the compression level you choose. Low compression preserves most of the original quality, while extreme compression significantly reduces file size at the cost of some visual quality. You can select the compression level that best suits your needs based on how you'll use the images."
    },
    { 
      id: 'size-limit',
      question: "Is there a file size limit?", 
      answer: "Yes, there is a 100MB file size limit for each image you upload. For larger files, you may need to resize the image first or use specialized software. This limit is in place to ensure optimal performance and processing speed."
    },
    { 
      id: 'security',
      question: "Are my images secure during compression?", 
      answer: "Yes, all processing happens on our servers, but your images are not stored permanently. They are automatically deleted after processing. We do not share, analyze, or use your image content for any purpose other than providing the compression service you requested."
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
                Powerful Image Compression
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                Image <span className="gradient-text">Compression</span> Tool
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Reduce image file sizes while maintaining visual quality for faster websites and efficient sharing.
              </p>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-8 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
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
                  <IconPhoto size={18} className="mr-2" />
                  Compress
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'about'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconInfoCircle size={18} className="mr-2" />
                  About
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'compress' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white">
                      <IconPhoto size={24} stroke={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">Compress Images</h2>
                      <p className="text-gray-600 dark:text-gray-400">Optimize your images while maintaining visual quality</p>
                    </div>
                  </div>
                  
                  <CompressImages />
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
                      <h2 className="text-2xl font-display font-bold">About Image Compression</h2>
                      <p className="text-gray-600 dark:text-gray-400">Learn more about how image compression works and its benefits</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                      Image compression is essential for optimizing your website performance and reducing bandwidth usage. Our tool helps you compress images efficiently while maintaining an acceptable level of visual quality.
                    </p>
                    
                    <p className="mt-4">
                      Whether you're preparing images for your website, social media, or email attachments, our tool provides the perfect balance between file size and image quality. You can choose from different compression levels based on your specific needs.
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
                          Your images are processed securely and automatically deleted after compression. We prioritize your privacy and data security.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconRocket size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Fast Processing</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Optimized algorithms ensure quick and efficient compression of your images, saving you valuable time.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconDeviceLaptop size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Web-Based Solution</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No downloads or installations required. Access our powerful image compression tool directly in your browser from any device.
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
                Learn more about image compression and how our tool can help you optimize your images.
              </p>
            </div>

            <div className="space-y-3">
              {faqItems.map(faq => (
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