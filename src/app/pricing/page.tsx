"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { 
  IconCheck,
  IconX,
  IconArrowRight,
  IconCrown,
  IconRocket,
  IconBuildingSkyscraper
} from "@tabler/icons-react";

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  
  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Great for occasional use and small files",
      icon: <IconRocket className="w-6 h-6" stroke={1.5} />,
      features: [
        { name: "Basic compression tools", included: true },
        { name: "Up to 100MB per file", included: true },
        { name: "5 files per day limit", included: true },
        { name: "Basic support", included: true },
        { name: "Advanced compression settings", included: false },
        { name: "Password protection", included: false },
        { name: "Priority processing", included: false },
      ],
      cta: "Get Started",
      popular: false,
      variant: "outline",
    },
    {
      name: "Pro",
      price: { monthly: 9.99, annual: 7.99 },
      description: "Perfect for individuals with regular file needs",
      icon: <IconCrown className="w-6 h-6" stroke={1.5} />,
      features: [
        { name: "All compression tools", included: true },
        { name: "Up to 1GB per file", included: true },
        { name: "Unlimited files", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced compression settings", included: true },
        { name: "Password protection", included: true },
        { name: "Priority processing", included: false },
      ],
      cta: "Get Pro",
      popular: true,
      variant: "gradient",
    },
    {
      name: "Business",
      price: { monthly: 24.99, annual: 19.99 },
      description: "For teams and businesses with high-volume needs",
      icon: <IconBuildingSkyscraper className="w-6 h-6" stroke={1.5} />,
      features: [
        { name: "All compression tools", included: true },
        { name: "Up to 10GB per file", included: true },
        { name: "Unlimited files", included: true },
        { name: "24/7 priority support", included: true },
        { name: "Advanced compression settings", included: true },
        { name: "Password protection", included: true },
        { name: "Priority processing", included: true },
      ],
      cta: "Get Business",
      popular: false,
      variant: "primary",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black py-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/3 top-1/4 w-96 h-96 bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                Simple, Transparent <span className="gradient-text">Pricing</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
                Choose the plan that fits your needs. All plans come with our core features.
              </p>
              
              {/* Toggle switch */}
              <div className="flex items-center justify-center mb-12">
                <span className={`text-sm ${!annual ? 'text-pink-600 dark:text-pink-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  Monthly
                </span>
                <button 
                  onClick={() => setAnnual(!annual)}
                  className="relative mx-4 h-6 w-12 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
                  aria-pressed={annual}
                >
                  <span className="sr-only">Toggle billing period</span>
                  <span 
                    className={`transform transition-transform duration-200 ease-in-out h-5 w-5 rounded-full bg-white shadow-md absolute left-0.5 top-0.5 ${
                      annual ? 'translate-x-6' : 'translate-x-0'
                    }`} 
                  />
                </button>
                <span className={`text-sm ${annual ? 'text-pink-600 dark:text-pink-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  Annual <span className="text-xs px-2 py-0.5 ml-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">Save 20%</span>
                </span>
              </div>
            </div>
            
            {/* Pricing cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, i) => (
                <div 
                  key={plan.name}
                  className={`relative rounded-xl bg-white dark:bg-gray-800 shadow-md ${
                    plan.popular ? 'border-2 border-pink-600 dark:border-pink-400 ring-4 ring-pink-500/20 transform md:-translate-y-4' : 'border border-gray-200 dark:border-gray-700'
                  } overflow-hidden animate-fade-in`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="text-xs font-medium px-3 py-1 bg-pink-600 text-white transform rotate-45 translate-x-6 translate-y-1">
                        POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg ${plan.popular ? 'bg-gradient-to-r from-pink-600 to-violet-600' : 'bg-pink-500/10 dark:bg-pink-500/20'} text-white mr-3`}>
                        {plan.icon}
                      </div>
                      <h3 className="text-2xl font-display font-bold">
                        {plan.name}
                      </h3>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">
                          ${annual ? plan.price.annual : plan.price.monthly}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="ml-2 text-gray-500 dark:text-gray-400">
                            / month
                          </span>
                        )}
                      </div>
                      {plan.price.monthly > 0 && annual && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Billed annually (${plan.price.annual * 12}/year)
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {plan.description}
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start">
                          {feature.included ? (
                            <IconCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" stroke={2} />
                          ) : (
                            <IconX className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" stroke={2} />
                          )}
                          <span className={feature.included ? "" : "text-gray-500 dark:text-gray-400"}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      variant={plan.variant as any}
                      fullWidth
                      size="lg"
                      icon={plan.popular ? <IconArrowRight className="w-4 h-4" /> : undefined}
                      iconPosition="right"
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Find answers to common questions about our pricing and features.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Can I switch plans later?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, you'll be prorated for the remainder of your billing period. If you downgrade, the new plan will take effect at the next billing cycle.
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Are there any hidden fees?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No, the price you see is the price you pay. There are no additional fees or charges. We believe in transparent pricing.
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer a 14-day money-back guarantee. If you're not satisfied with our service, you can request a full refund within 14 days of your purchase.
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <h3 className="text-xl font-medium mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. For annual plans, we can also accommodate bank transfers and purchase orders.
                </p>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <h3 className="text-xl font-medium mb-3">
                  Do you offer custom plans for large teams?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, we offer custom enterprise plans for larger teams with specific needs. Contact our sales team for a custom quote.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-violet-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Choose the plan that's right for you and start optimizing your files today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
              >
                Try For Free
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 