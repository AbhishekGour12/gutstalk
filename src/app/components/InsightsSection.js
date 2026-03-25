"use client";
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const CpuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
  </svg>
);

const UserCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M16 11l2 2 4-4" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16z" />
    <path d="M4 20c4-4 8-8 16-16" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 6l-9.5 9.5-5-5L1 18" />
    <path d="M17 6h6v6" />
  </svg>
);

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const SmileIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8 7 6 10 6 14a6 6 0 0012 0c0-4-2-7-6-12z" />
  </svg>
);

const PieChartIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12A9 9 0 1112 3v9z" />
    <path d="M12 3a9 9 0 019 9h-9z" />
  </svg>
);

import { 
  MdOutlineAnalytics, 
  MdOutlineHealthAndSafety,
  MdOutlineScience
} from 'react-icons/md';
import Image from 'next/image';

const InsightsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Feature cards data - Updated with Teal theme
  const features = [
    {
      icon: CpuIcon,
      title: "AI-Based Analysis",
      description: "Advanced algorithms analyze 50+ gut health markers",
      color: "#18606D",
      gradient: "from-[#18606D]/5 to-[#2A7F8F]/5"
    },
    {
      icon: UserCheckIcon,
      title: "Doctor-Recommended Plans",
      description: "Verified by leading gastroenterologists",
      color: "#2A7F8F",
      gradient: "from-[#2A7F8F]/5 to-[#CFE8EC]/5"
    },
    {
      icon: LeafIcon,
      title: "Natural Solutions",
      description: "Evidence-based dietary and lifestyle interventions",
      color: "#18606D",
      gradient: "from-[#18606D]/5 to-[#2A7F8F]/5"
    },
    {
      icon: TrendingUpIcon,
      title: "Trackable Progress",
      description: "Monitor improvements with detailed health reports",
      color: "#2A7F8F",
      gradient: "from-[#2A7F8F]/5 to-[#CFE8EC]/5"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.3 }
    }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#F4FAFB] via-white to-[#F4FAFB]">
      {/* Background Elements - Teal Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#CFE8EC]/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#D9EEF2]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#18606D]/5 rounded-full blur-3xl" />
        
        {/* Floating Particles */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#2A7F8F]/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#18606D]/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* LEFT SIDE - Product UI Mockup - Teal Theme */}
          <motion.div
            ref={ref}
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative order-2 lg:order-1"
          >
            {/* Main Mockup Container */}
            <div className="relative group">
              {/* Glass Card Background - Teal */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#18606D]/5 to-[#2A7F8F]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#D9EEF2] overflow-hidden">
                {/* Mockup Header - Teal Gradient */}
                <div className="bg-gradient-to-r from-[#18606D] to-[#2A7F8F] px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm font-medium">
                      GutHealth Dashboard
                    </div>
                    <div className="w-16" />
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="p-4 sm:p-6 md:p-8">
                  {/* User Profile Section */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#D9EEF2]">
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] flex items-center justify-center shadow-md">
                        <SmileIcon className="text-white text-lg sm:text-xl" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base">Sarah Johnson</h3>
                      <p className="text-xs text-[#64748B]">Member since Jan 2024</p>
                    </div>
                  </div>

                  {/* Health Score Section */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium text-[#64748B]">Overall Gut Health Score</span>
                      <span className="text-sm sm:text-base font-bold text-[#18606D]">84/100</span>
                    </div>
                    <div className="h-2 sm:h-2.5 bg-[#CFE8EC] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={isInView ? { width: "84%" } : {}}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Analytics Cards - Teal Theme */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {[
                      { label: "Gut Diversity", value: "78%", icon: ActivityIcon, trend: "+12%", trendUp: true },
                      { label: "Digestion", value: "92%", icon: DropletIcon, trend: "+8%", trendUp: true },
                      { label: "Inflammation", value: "31%", icon: PieChartIcon, trend: "-15%", trendUp: false },
                      { label: "Energy Level", value: "76%", icon: TrendingUpIcon, trend: "+20%", trendUp: true }
                    ].map((metric, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="bg-[#F4FAFB] rounded-xl p-2.5 sm:p-3 border border-[#D9EEF2] hover:border-[#CFE8EC] hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <metric.icon className="text-[#18606D] text-xs sm:text-sm" />
                          <span className={`text-[10px] sm:text-xs font-medium ${metric.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {metric.trend}
                          </span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-[#0F172A]">{metric.value}</p>
                        <p className="text-[10px] sm:text-xs text-[#64748B]">{metric.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recommendations Section - Teal Theme */}
                  <div className="bg-gradient-to-r from-[#CFE8EC]/30 to-[#D9EEF2]/30 rounded-xl p-3 sm:p-4 border border-[#D9EEF2]">
                    <div className="flex items-center gap-2 mb-2">
                      <MdOutlineScience className="text-[#18606D] text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">AI Recommendations</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      Increase fiber intake • Add fermented foods • 30 min daily walk • Stay hydrated
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements - Teal */}
              <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#18606D]/10 to-[#2A7F8F]/10 rounded-full blur-xl" />
              <div className="absolute -bottom-3 -left-3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#2A7F8F]/10 to-[#CFE8EC]/10 rounded-full blur-xl" />
            </div>
          </motion.div>

          {/* RIGHT SIDE - Content */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="order-1 lg:order-2"
          >
            {/* Section Badge - Teal Theme */}
            <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#CFE8EC] rounded-full border border-[#D9EEF2]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18606D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18606D]"></span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#18606D]">Smart Insights</span>
              </span>
            </motion.div>

            {/* Heading - Teal Gradient */}
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.2] tracking-tight mb-4 sm:mb-6"
            >
              <span className="text-[#0F172A]">Personalized Health Insights</span>
              <br />
              <span className="bg-gradient-to-r from-[#18606D] to-[#2A7F8F] bg-clip-text text-transparent">
                Powered by Science
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-[#64748B] leading-relaxed mb-8 sm:mb-10 max-w-lg"
            >
              Unlock your body's full potential with AI-driven analysis, doctor-approved protocols, 
              and personalized recommendations tailored to your unique gut profile.
            </motion.p>

            {/* Feature Cards Grid - Teal Theme */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -6,
                    transition: { duration: 0.2 }
                  }}
                  className={`group relative bg-white rounded-2xl p-4 sm:p-5 border border-[#D9EEF2] hover:border-[#18606D]/30 hover:shadow-xl transition-all duration-300 cursor-pointer`}
                >
                  {/* Hover Gradient Background - Teal */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#CFE8EC] to-[#F4FAFB] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <feature.icon className="text-[#18606D] text-xl sm:text-2xl" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-1.5 sm:mb-2">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Line - Teal */}
                  <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-full border-b-2 border-r-2 border-[#18606D]/40 rounded-br-lg" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Indicator - Teal Theme */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#D9EEF2] flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] border-2 border-white flex items-center justify-center shadow-sm">
                      <span className="text-white text-[10px] sm:text-xs font-bold">✓</span>
                    </div>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-[#64748B]">Trusted by <strong className="text-[#18606D]">10,000+</strong> patients</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-[#F59E0B] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs sm:text-sm text-[#64748B] ml-1">4.9/5</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#18606D]" />
                <span className="text-xs text-[#64748B]">500+ Google Reviews</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Element */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F4FAFB] to-transparent pointer-events-none" />
    </section>
  );
};

export default InsightsSection;