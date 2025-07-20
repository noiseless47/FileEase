"use client";

import { useState, useEffect } from "react";
import SecureFiles from "@/components/SecureFiles";
import { 
  IconLock,
  IconLockOpen,
  IconInfoCircle, 
  IconShieldLock,
  IconKey,
  IconDeviceLaptop,
  IconQuestionMark,
  IconChevronDown
} from "@tabler/icons-react";

export default function SecureFilesPage() {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt' | 'about'>('encrypt');
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);
  
  // Handle URL parameters for direct tab access
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');
    if (tab === 'decrypt' || tab === 'about') {
      setActiveTab(tab);
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
      id: 'how-secure',
      question: "How secure is the file encryption?", 
      answer: (
        <div className="space-y-4">
          <p>
            We use industry-standard AES-256 encryption with PBKDF2 key derivation to secure your files. Each file is encrypted with a unique salt to enhance security. This level of encryption is considered extremely secure and is used by governments and financial institutions worldwide.
          </p>
          <div className="space-y-6 mt-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Password Protection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your password is used to generate an encryption key using PBKDF2 with 100,000 iterations and SHA-256 hashing.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Unique Salt</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Each file is encrypted with a randomly generated salt, ensuring that even files with the same password have different encryption.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Client-Side Processing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your password never leaves your device. All encryption and decryption occurs locally, ensuring maximum privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      id: 'file-types',
      question: "What file types can I encrypt?", 
      answer: "You can encrypt any type of file with our secure files feature. This includes documents, images, videos, spreadsheets, presentations, and more. There are no restrictions on file formats."
    },
    { 
      id: 'forgot-password',
      question: "What happens if I forget my password?", 
      answer: "If you forget your password, there is no way to recover your encrypted files. We do not store your passwords or encryption keys, so we cannot assist in recovering files if you lose your password. Make sure to remember your password or store it in a secure password manager."
    },
    { 
      id: 'file-sharing',
      question: "How do I share encrypted files with others?", 
      answer: "To share encrypted files with others, simply send them the encrypted file and separately communicate the password through a secure channel (such as a secure messaging app). The recipient will need to use our service to decrypt the file with the password you provided."
    },
    { 
      id: 'size-limit',
      question: "Is there a file size limit?", 
      answer: "Yes, there is a 100MB file size limit for each file you upload for encryption. For larger files, you may need to compress them first or split them into smaller parts. This limit is in place to ensure optimal performance and processing speed."
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
                Advanced Security Protection
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                Secure <span className="gradient-text">File Protection</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Protect your sensitive files with military-grade encryption. Simple, secure, and private.
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
                  onClick={() => setActiveTab('encrypt')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'encrypt'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconLock size={18} className="mr-2" />
                  Encrypt
                </button>
                <button
                  onClick={() => setActiveTab('decrypt')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'decrypt'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconLockOpen size={18} className="mr-2" />
                  Decrypt
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
            {(activeTab === 'encrypt' || activeTab === 'decrypt') && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white">
                      {activeTab === 'encrypt' ? (
                        <IconLock size={24} stroke={1.5} />
                      ) : (
                        <IconLockOpen size={24} stroke={1.5} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">
                        {activeTab === 'encrypt' ? 'Encrypt Your Files' : 'Decrypt Your Files'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {activeTab === 'encrypt'
                          ? 'Protect your sensitive files with password encryption'
                          : 'Access your protected files with your password'}
                      </p>
                    </div>
                  </div>
                  
                  <SecureFiles initialMode={activeTab as 'encrypt' | 'decrypt'} />
                </div>
              </div>
            )}
            
            {activeTab === 'about' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white">
                      <IconShieldLock size={24} stroke={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">About File Security</h2>
                      <p className="text-gray-600 dark:text-gray-400">Learn more about how our file encryption works</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                      Our secure file service allows you to protect your sensitive documents, images, and other files
                      with strong encryption. This ensures that only people with the correct password can access your files,
                      making it ideal for storing confidential information or sharing files securely.
                    </p>
                    
                    <p className="mt-4">
                      We use AES-256 encryption, which is one of the strongest encryption algorithms available today.
                      Your files are encrypted locally in your browser, which means your unencrypted data and passwords
                      never leave your device. This provides maximum privacy and security for your sensitive information.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">Key Benefits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconShieldLock size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Secure & Private</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Military-grade AES-256 encryption ensures your files remain private and protected from unauthorized access.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconKey size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Password Protection</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your files are locked with a password only you know. We never store your passwords or encryption keys.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconDeviceLaptop size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Web-Based Solution</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No downloads or installations required. Access our secure file tools directly in your browser.
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
                Learn more about our file security features and how to protect your sensitive information.
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