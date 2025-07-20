"use client";

import { useState, useEffect } from "react";
import PasswordProtectPDF from "@/components/PasswordProtectPDF";
import { 
  IconLock,
  IconLockOpen,
  IconInfoCircle, 
  IconShieldLock,
  IconKey,
  IconFileText,
  IconQuestionMark,
  IconChevronDown,
  IconLockAccess
} from "@tabler/icons-react";

export default function PasswordProtectPage() {
  const [activeTab, setActiveTab] = useState<'protect' | 'unlock' | 'about'>('protect');
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);
  
  // Handle URL parameters for direct tab access
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');
    if (tab === 'unlock' || tab === 'about') {
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
      id: 'difference',
      question: "What's the difference between PDF password protection and file encryption?", 
      answer: (
        <div>
          <p>
            <strong>PDF Password Protection</strong> uses the built-in security features of the PDF format to restrict access and permissions. It's specific to PDF files and is recognized by most PDF readers, but it provides a moderate level of security.
          </p>
          <p className="mt-2">
            <strong>File Encryption</strong> applies strong encryption to any file type, completely scrambling the contents. This provides military-grade security but requires specialized software (like our secure files tool) to decrypt and access the files.
          </p>
          <p className="mt-2">
            Choose PDF password protection if you need standard PDF security that works with common PDF readers. Choose file encryption for maximum security across any file type.
          </p>
        </div>
      )
    },
    { 
      id: 'user-vs-owner',
      question: "What's the difference between User and Owner passwords?", 
      answer: (
        <div>
          <p>
            <strong>User Password:</strong> Required to open and view the document. Anyone without this password cannot open the file at all.
          </p>
          <p className="mt-2">
            <strong>Owner Password:</strong> Provides full access to the document, including the ability to change security settings or remove the password protection. A person with the owner password can bypass all restrictions.
          </p>
          <p className="mt-2">
            You can set just one or both types of passwords. If you only set a user password, it will also function as the owner password.
          </p>
        </div>
      )
    },
    { 
      id: 'permissions',
      question: "How do PDF permissions work?", 
      answer: "PDF permissions control what actions readers can perform on your document, such as printing, copying text, modifying content, or adding annotations. Note that these restrictions are only enforced when a user opens the document with the user password. Someone with the owner password can change these permissions. Also, some PDF readers may not fully enforce all restrictions."
    },
    { 
      id: 'forgot-password',
      question: "What if I forget my PDF password?", 
      answer: "If you forget your password for a protected PDF, there's no built-in way to recover it. This is why it's important to remember your passwords or store them securely in a password manager. For critical documents, consider keeping an unprotected backup in a secure location."
    },
    { 
      id: 'security-level',
      question: "How secure is PDF password protection?", 
      answer: "Modern PDF password protection uses AES-256 encryption, which is very strong. However, the overall security also depends on the strength of your password. Simple or short passwords can be cracked relatively easily. For maximum security, use long, complex passwords with a mix of letters, numbers, and special characters, and consider using our full file encryption feature for highly sensitive documents."
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
                PDF Security
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                Password <span className="gradient-text">Protect PDFs</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Secure your PDF documents with passwords and custom permissions. Compatible with all PDF readers.
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
                  onClick={() => setActiveTab('protect')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'protect'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconLock size={18} className="mr-2" />
                  Protect PDF
                </button>
                <button
                  onClick={() => setActiveTab('unlock')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'unlock'
                      ? "bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconLockOpen size={18} className="mr-2" />
                  Unlock PDF
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
            {(activeTab === 'protect' || activeTab === 'unlock') && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white">
                      {activeTab === 'protect' ? (
                        <IconLock size={24} stroke={1.5} />
                      ) : (
                        <IconLockOpen size={24} stroke={1.5} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">
                        {activeTab === 'protect' ? 'Password Protect PDF' : 'Unlock PDF Document'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {activeTab === 'protect'
                          ? 'Add password protection and set permissions for your PDF'
                          : 'Remove password protection from your PDF document'}
                      </p>
                    </div>
                  </div>
                  
                  <PasswordProtectPDF initialMode={activeTab as 'protect' | 'unlock'} />
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
                      <h2 className="text-2xl font-display font-bold">About PDF Password Protection</h2>
                      <p className="text-gray-600 dark:text-gray-400">Understanding how PDF security works</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p>
                      PDF password protection is a built-in security feature of the PDF format that allows you to restrict 
                      access to your documents. With our tool, you can add two types of password protection:
                    </p>
                    
                    <ul>
                      <li><strong>User Password:</strong> Required to open and view the document</li>
                      <li><strong>Owner Password:</strong> Provides full access and permission to change settings</li>
                    </ul>
                    
                    <p className="mt-4">
                      Beyond password protection, you can also set specific permissions to control what users can do 
                      with your document, such as whether they can print it, copy content, modify it, or add annotations.
                    </p>
                    
                    <p>
                      The password protection we apply uses industry-standard encryption supported by all major PDF readers,
                      including Adobe Acrobat, PDF-XChange, and Preview on macOS.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">Key Benefits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconShieldLock size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Universal Compatibility</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Protected PDFs work with all standard PDF readers, no special software required to view.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconKey size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Granular Permissions</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Control exactly what users can do - print, copy, modify, fill forms, or annotate your PDF.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
                          <IconFileText size={20} stroke={1.5} />
                        </div>
                        <h4 className="font-medium mb-1">Document Control</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Perfect for sensitive business documents, contracts, and confidential information.
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
                Learn more about PDF password protection and how it can help secure your documents.
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