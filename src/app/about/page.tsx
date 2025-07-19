"use client";

import Image from "next/image";
import Button from "@/components/Button";
import { 
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconMail,
  IconStar
} from "@tabler/icons-react";

export default function About() {
  // Team members data
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Alex has over 10 years of experience in software development and previously founded two successful tech startups.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Sophia Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Sophia is an expert in file compression algorithms with a PhD in Computer Science from MIT.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    {
      name: "Marcus Williams",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      bio: "Marcus specializes in web technologies and has been building browser-based applications for over 8 years.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
  ];

  // Company values
  const values = [
    {
      title: "Privacy First",
      description: "We believe your files should stay on your device. We never process your data on our servers.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Simplicity",
      description: "We design our tools to be intuitive and easy to use, with no unnecessary complexity.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V12M12 12L16 10M12 12V18M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Innovation",
      description: "We're constantly improving our tools and algorithms to provide the best possible experience.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.66347 17H14.3364M11.9999 3V4M18.3639 5.63604L17.6568 6.34315M21 11.9999H20M4 11.9999H3M6.34309 6.34315L5.63599 5.63604M8.46441 15.5356C6.51179 13.5829 6.51179 10.4171 8.46441 8.46449C10.417 6.51187 13.5829 6.51187 15.5355 8.46449C17.4881 10.4171 17.4881 13.5829 15.5355 15.5356L14.9884 16.0827C14.3555 16.7155 13.9999 17.5739 13.9999 18.469V19C13.9999 20.1046 13.1045 21 11.9999 21C10.8954 21 9.99995 20.1046 9.99995 19V18.469C9.99995 17.5739 9.6444 16.7155 9.01151 16.0827L8.46441 15.5356Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Transparency",
      description: "We're open about how our tools work and what happens to your files when you use them.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black py-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl"></div>
            <div className="absolute right-1/4 bottom-1/3 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6">
                About <span className="gradient-text">FileEase</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We're on a mission to make file management simple, secure, and accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <h2 className="text-3xl font-display font-bold mb-6">Our Story</h2>
                <div className="prose dark:prose-invert">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    FileEase was born out of frustration with existing file utilities that were either too complex, required downloads and installations, or compromised user privacy.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Founded in 2023, our team of developers and designers came together with a shared vision: to create browser-based file tools that are powerful yet intuitive, while keeping your data completely private and secure.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Today, FileEase is used by thousands of people worldwide who value both simplicity and privacy when working with their files.
                  </p>
                </div>
              </div>
              
              <div className="relative h-80 md:h-full animate-fade-in">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Our office"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/50 to-transparent opacity-30 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                The principles that guide everything we do at FileEase
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <div 
                  key={value.title}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                The talented people behind FileEase
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, i) => (
                <div 
                  key={member.name}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                    <p className="text-pink-600 dark:text-pink-400 font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {member.bio}
                    </p>
                    <div className="flex space-x-3">
                      <a href={member.social.twitter} className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                        <IconBrandTwitter className="w-5 h-5" />
                      </a>
                      <a href={member.social.linkedin} className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                        <IconBrandLinkedin className="w-5 h-5" />
                      </a>
                      <a href={member.social.github} className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                        <IconBrandGithub className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-gray-50 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">What People Say</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Feedback from our users
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "FileEase has simplified my workflow tremendously. The fact that my files never leave my browser gives me peace of mind.",
                  author: "Jamie R.",
                  role: "Digital Marketer"
                },
                {
                  quote: "As a photographer, I deal with large files daily. FileEase's compression tools are the best I've found online.",
                  author: "Miguel S.",
                  role: "Professional Photographer"
                },
                {
                  quote: "I use FileEase for all my document processing needs. The interface is clean and intuitive, exactly what I was looking for.",
                  author: "Sarah T.",
                  role: "Content Creator"
                }
              ].map((testimonial, i) => (
                <div 
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <IconStar key={j} className="w-5 h-5 text-yellow-500" fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mb-4 text-gray-600 dark:text-gray-300 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-violet-600 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                icon={<IconMail className="w-5 h-5" />}
              >
                Contact Us
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                Join Our Team
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 