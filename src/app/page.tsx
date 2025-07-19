import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { 
  IconArchive, 
  IconPhoto, 
  IconFileText, 
  IconFileZip, 
  IconArrowRight, 
  IconDeviceLaptop,
  IconLock,
  IconRocket,
  IconAdjustments,
  IconCreditCard,
  IconBuildingSkyscraper,
  IconUserCircle,
  IconFileDescription,
  IconFiles,
  IconCloudUpload
} from '@tabler/icons-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 -mt-10 -mr-20 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-3xl"></div>
            <div className="absolute left-0 bottom-0 -mb-10 -ml-20 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="animate-fade-in">
                <span className="inline-block px-4 py-2 rounded-full bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 font-medium text-sm mb-6">
                  Simplify Your File Management
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6">
                  File Utilities Made <span className="gradient-text">Simple</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                  Compress, manage, and optimize your files with beautiful, secure tools that respect your privacy.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/features">
                    <Button 
                      size="lg" 
                      variant="gradient" 
                      icon={<IconRocket />}
                    >
                      Explore Features
                    </Button>
                  </Link>
                  <Link href="/compression">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      icon={<IconFileZip />}
                    >
                      Try Compression
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Feature highlights */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm animate-slide-up">
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4 mx-auto">
                    <IconDeviceLaptop size={24} stroke={1.5} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Browser-Based</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No downloads required. Process files directly in your browser.
                  </p>
                </div>
                
                <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4 mx-auto">
                    <IconLock size={24} stroke={1.5} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Private & Secure</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Files never leave your device. Complete privacy.
                  </p>
                </div>
                
                <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm animate-slide-up" style={{ animationDelay: "0.4s" }}>
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4 mx-auto">
                    <IconRocket size={24} stroke={1.5} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Optimized algorithms for quick processing of files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Powerful File Utilities
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our suite of tools makes file management simple, efficient, and accessible to everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card 
                title="Available Features" 
                description="Powerful tools ready to use right now"
                icon={<IconRocket className="w-6 h-6" stroke={1.5} />}
                gradient={true}
              >
                <div className="space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                        <IconArchive className="w-6 h-6" stroke={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium">File Compression</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Reduce file sizes for easier sharing</p>
                      </div>
                      <Link href="/compression" className="ml-auto">
                        <Button 
                          size="sm"
                          variant="ghost" 
                          icon={<IconArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          Try Now
                        </Button>
                      </Link>
                    </li>
                    
                    <li className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
                        <IconFileZip className="w-6 h-6" stroke={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium">ZIP/UNZIP Files</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Create and extract ZIP archives</p>
                      </div>
                      <Link href="/zip-unzip" className="ml-auto">
                        <Button 
                          size="sm"
                          variant="ghost" 
                          icon={<IconArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          Try Now
                        </Button>
                      </Link>
                    </li>
                    
                    <li className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                        <IconFileDescription className="w-6 h-6" stroke={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium">File Information</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">View detailed metadata of your files</p>
                      </div>
                      <Link href="/features" className="ml-auto">
                        <Button 
                          size="sm"
                          variant="ghost" 
                          icon={<IconArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          Try Now
                        </Button>
                      </Link>
                    </li>
                  </ul>
                  
                  <div className="pt-2">
                    <Link href="/features">
                      <Button 
                        variant="outline" 
                        icon={<IconArrowRight className="w-4 h-4" />}
                        iconPosition="right"
                      >
                        View All Features
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
              
              <Card 
                title="Coming Soon" 
                description="More powerful file utilities are on the way"
                icon={<IconCloudUpload className="w-6 h-6" stroke={1.5} />}
              >
                <div className="space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-pink-600 dark:text-pink-400">
                        <IconPhoto className="w-6 h-6" stroke={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium">Image Optimization</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Resize, compress and optimize images</p>
                      </div>
                      <span className="ml-auto px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        Soon
                      </span>
                    </li>
                    
                    <li className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-violet-600 dark:text-violet-400">
                        <IconFileText className="w-6 h-6" stroke={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium">PDF Operations</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Merge, split, and extract PDF content</p>
                      </div>
                      <span className="ml-auto px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        Soon
                      </span>
                    </li>
                    
                    <li className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-pink-600 dark:text-pink-400">
                        <IconFiles className="w-6 h-6" stroke={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium">File Conversion</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Convert between common file formats</p>
                      </div>
                      <span className="ml-auto px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        Soon
                      </span>
                    </li>
                  </ul>
                  
                  <div className="pt-2">
                    <Link href="/features">
                      <Button 
                        variant="ghost" 
                        icon={<IconArrowRight className="w-4 h-4" />}
                        iconPosition="right"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Simple, secure, and straightforward process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 text-white flex items-center justify-center text-lg font-semibold mb-6 mx-auto shadow-lg">
                  1
                </div>
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                <h3 className="text-xl font-semibold text-center mb-4">Upload Files</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Drag and drop your files into the upload area or click to select files from your device.
                </p>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 text-white flex items-center justify-center text-lg font-semibold mb-6 mx-auto shadow-lg">
                  2
                </div>
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                <h3 className="text-xl font-semibold text-center mb-4">Choose Options</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Select the compression level and other settings based on your specific needs.
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 text-white flex items-center justify-center text-lg font-semibold mb-6 mx-auto shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">Process & Download</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Click the process button and download your processed files instantly. No waiting!
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">Privacy First:</span> All processing happens in your browser. Your files are never uploaded to our servers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Links Section */}
        <section className="py-16 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Explore More
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Discover everything FileEase has to offer
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Link href="/features">
                <div className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 p-6 rounded-xl flex items-center border border-gray-200 dark:border-gray-800 transition-colors group cursor-pointer">
                  <div className="p-3 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30 transition-colors mr-4">
                    <IconAdjustments className="w-6 h-6 text-pink-600 dark:text-pink-400" stroke={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg">Features</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Explore all our powerful tools</p>
                  </div>
                  <IconArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform" stroke={1.5} />
                </div>
              </Link>
              
              <Link href="/pricing">
                <div className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 p-6 rounded-xl flex items-center border border-gray-200 dark:border-gray-800 transition-colors group cursor-pointer">
                  <div className="p-3 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30 transition-colors mr-4">
                    <IconCreditCard className="w-6 h-6 text-pink-600 dark:text-pink-400" stroke={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg">Pricing</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Simple, transparent pricing plans</p>
                  </div>
                  <IconArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform" stroke={1.5} />
                </div>
              </Link>
              
              <Link href="/about">
                <div className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 p-6 rounded-xl flex items-center border border-gray-200 dark:border-gray-800 transition-colors group cursor-pointer">
                  <div className="p-3 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30 transition-colors mr-4">
                    <IconUserCircle className="w-6 h-6 text-pink-600 dark:text-pink-400" stroke={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg">About Us</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Learn about our team and values</p>
                  </div>
                  <IconArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform" stroke={1.5} />
                </div>
              </Link>
              
              <Link href="/compression">
                <div className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 p-6 rounded-xl flex items-center border border-gray-200 dark:border-gray-800 transition-colors group cursor-pointer">
                  <div className="p-3 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30 transition-colors mr-4">
                    <IconArchive className="w-6 h-6 text-pink-600 dark:text-pink-400" stroke={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg">File Compression</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Reduce file sizes easily</p>
                  </div>
                  <IconArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform" stroke={1.5} />
                </div>
              </Link>
              
              <Link href="/features">
                <div className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 p-6 rounded-xl flex items-center border border-gray-200 dark:border-gray-800 transition-colors group cursor-pointer">
                  <div className="p-3 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30 transition-colors mr-4">
                    <IconFileText className="w-6 h-6 text-pink-600 dark:text-pink-400" stroke={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg">Document Tools</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Work with PDFs and text files</p>
                  </div>
                  <IconArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform" stroke={1.5} />
                </div>
              </Link>
              
              <Link href="/pricing">
                <div className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 p-6 rounded-xl flex items-center border border-gray-200 dark:border-gray-800 transition-colors group cursor-pointer">
                  <div className="p-3 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 group-hover:bg-pink-500/20 dark:group-hover:bg-pink-500/30 transition-colors mr-4">
                    <IconBuildingSkyscraper className="w-6 h-6 text-pink-600 dark:text-pink-400" stroke={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg">Enterprise</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Solutions for businesses</p>
                  </div>
                  <IconArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform" stroke={1.5} />
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-violet-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">
              Ready to Try Our Advanced File Tools?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Start using our powerful file utilities today. No signup required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/features">
                <Button 
                  size="lg"
                  variant="secondary"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  Explore Pricing
                </Button>
              </Link>
            </div>
        </div>
        </section>
      </main>
    </div>
  );
}
