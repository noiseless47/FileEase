"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";
import { 
  IconArchive,
  IconPhoto, 
  IconFileZip, 
  IconFileText, 
  IconArrowRight,
  IconDeviceLaptop,
  IconAdjustments,
  IconFiles,
  IconLock,
  IconRocket
} from "@tabler/icons-react";

export default function Features() {
  const [activeTab, setActiveTab] = useState("compression");

  const tabs = [
    { id: "compression", name: "Compression", icon: <IconArchive size={18} /> },
    { id: "images", name: "Images", icon: <IconPhoto size={18} /> },
    { id: "documents", name: "Documents", icon: <IconFileText size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                Feature-Packed <span className="gradient-text">File Tools</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover the full suite of powerful tools designed to make file management effortless.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Tabs */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-10">
              <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {activeTab === "compression" && (
                <>
                  <Card 
                    title="ZIP Compression" 
                    description="Compress multiple files into a single ZIP archive"
                    icon={<IconFileZip className="w-6 h-6" stroke={1.5} />}
                    gradient={true}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Compress multiple files</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Adjustable compression levels</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Secure & private processing</span>
                        </li>
                      </ul>
                      <Link href="/zip-unzip?tab=zip">
                        <Button 
                          variant="gradient"
                          fullWidth
                          icon={<IconArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          Compress Files
                        </Button>
                      </Link>
                    </div>
                  </Card>

                  <Card 
                    title="Archive Extraction" 
                    description="Easily extract ZIP, RAR, and other archive formats"
                    icon={<IconFiles className="w-6 h-6" stroke={1.5} />}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Extract common archive formats</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Preview archive contents</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Select specific files to extract</span>
                        </li>
                      </ul>
                      <Button 
                        variant="outline"
                        fullWidth
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </Card>

                  <Card 
                    title="Advanced Compression" 
                    description="Fine-tune compression settings for optimal results"
                    icon={<IconAdjustments className="w-6 h-6" stroke={1.5} />}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Custom compression algorithms</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Password protection</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Split archives for large files</span>
                        </li>
                      </ul>
                      <Button 
                        variant="outline"
                        fullWidth
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "images" && (
                <>
                  <Card 
                    title="Image Compression" 
                    description="Reduce image size while maintaining quality"
                    icon={<IconPhoto className="w-6 h-6" stroke={1.5} />}
                    gradient={true}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Compress JPEG, PNG, WebP</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Adjustable quality settings</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Batch processing</span>
                        </li>
                      </ul>
                      <Link href="/image-compression">
                        <Button 
                          variant="gradient"
                          fullWidth
                          icon={<IconArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          Compress Images
                        </Button>
                      </Link>
                    </div>
                  </Card>

                  <Card 
                    title="Format Conversion" 
                    description="Convert between image formats with ease"
                    icon={<IconAdjustments className="w-6 h-6" stroke={1.5} />}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Convert to JPEG, PNG, WebP</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Modern format optimization</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Bulk conversions</span>
                        </li>
                      </ul>
                      <Button 
                        variant="outline"
                        fullWidth
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </Card>

                  <Card 
                    title="Image Resizing" 
                    description="Resize images to exact dimensions"
                    icon={<IconFiles className="w-6 h-6" stroke={1.5} />}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Custom dimensions</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Maintain aspect ratio</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Social media presets</span>
                        </li>
                      </ul>
                      <Button 
                        variant="outline"
                        fullWidth
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "documents" && (
                <>
                  <Card 
                    title="PDF Compression" 
                    description="Reduce PDF file size while preserving quality"
                    icon={<IconFileText className="w-6 h-6" stroke={1.5} />}
                    gradient={true}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Optimize PDF documents</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Quality presets</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Batch processing</span>
                        </li>
                      </ul>
                      <Link href="/compression">
                        <Button 
                          variant="gradient"
                          fullWidth
                          icon={<IconArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          Compress PDF
                        </Button>
                      </Link>
                    </div>
                  </Card>

                  <Card 
                    title="Text Extraction" 
                    description="Extract text from PDFs and other documents"
                    icon={<IconDeviceLaptop className="w-6 h-6" stroke={1.5} />}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>OCR technology</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Multiple language support</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Export to various formats</span>
                        </li>
                      </ul>
                      <Button 
                        variant="outline"
                        fullWidth
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </Card>

                  <Card 
                    title="Secure Documents" 
                    description="Password protect and encrypt your documents"
                    icon={<IconLock className="w-6 h-6" stroke={1.5} />}
                  >
                    <div className="space-y-4">
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Strong encryption</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Password protection</span>
                        </li>
                        <li className="flex items-center">
                          <IconArrowRight className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                          <span>Digital signatures</span>
                        </li>
                      </ul>
                      <Button 
                        variant="outline"
                        fullWidth
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16 bg-gray-50 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Key Benefits
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our tools are designed with these core principles in mind
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                  <IconLock size={24} stroke={1.5} />
                </div>
                <h3 className="text-lg font-medium mb-2">Secure & Private</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your files are processed securely with advanced encryption. We prioritize your privacy and data security at every step.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                  <IconRocket size={24} stroke={1.5} />
                </div>
                <h3 className="text-lg font-medium mb-2">Fast Processing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Optimized algorithms ensure quick and efficient processing of your files, saving you valuable time while maintaining quality.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                  <IconDeviceLaptop size={24} stroke={1.5} />
                </div>
                <h3 className="text-lg font-medium mb-2">Web-Based Solution</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No downloads or installations required. Access powerful file tools directly in your browser from any device.
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Compare Our Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                See how FileEase compares to other file utility solutions
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-pink-600 to-violet-600 text-white">
                    <th className="p-4 text-left rounded-tl-lg">Feature</th>
                    <th className="p-4 text-center">FileEase</th>
                    <th className="p-4 text-center">Others</th>
                    <th className="p-4 text-center rounded-tr-lg">Desktop Apps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <td className="p-4 font-medium">Browser-Based</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                    <td className="p-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <td className="p-4 font-medium">No Installation Required</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                    <td className="p-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <td className="p-4 font-medium">Files Stay on Your Device</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                    <td className="p-4 text-center text-red-500">✗</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <td className="p-4 font-medium">Advanced Compression</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                    <td className="p-4 text-center text-red-500">✗</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <td className="p-4 font-medium">Free to Use</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                    <td className="p-4 text-center text-red-500">Limited</td>
                    <td className="p-4 text-center text-red-500">Paid</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium rounded-bl-lg">Beautiful UI</td>
                    <td className="p-4 text-center text-green-500">✓</td>
                    <td className="p-4 text-center text-red-500">✗</td>
                    <td className="p-4 text-center text-red-500 rounded-br-lg">Varies</td>
                  </tr>
                </tbody>
              </table>
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
              <Link href="/compression">
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