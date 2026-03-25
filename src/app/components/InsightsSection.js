"use client";
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { 
  MdOutlineAnalytics, 
  MdOutlineHealthAndSafety,
  MdOutlineScience
} from 'react-icons/md';
import Image from 'next/image';

// ========== Premium Background Visuals Component ==========
const BackgroundVisuals = () => {
  // Abstract Stomach Outline SVG (large background element)
  const StomachOutline = () => (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M200 50 C150 50, 120 80, 100 120 C80 160, 70 200, 80 250 C90 300, 120 340, 170 360 C210 375, 260 370, 300 340 C340 310, 360 260, 350 210 C340 160, 310 120, 270 90 C240 70, 220 50, 200 50Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M160 130 C150 150, 145 170, 150 190 C155 210, 170 220, 190 225"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M240 140 C250 160, 255 180, 250 200 C245 220, 230 230, 210 235"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );

  // Microbiome Organic Shapes (floating blobs)
  const MicrobiomeBlob = ({ size, opacity, delay }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 10 C65 10, 80 20, 85 35 C90 50, 85 70, 70 85 C55 100, 35 95, 20 80 C5 65, 5 40, 20 25 C35 10, 35 10, 50 10Z"
        fill="currentColor"
        opacity={opacity}
      />
    </svg>
  );

  // Floating animation variants
  const floatAnimation = (duration, yOffset, xOffset, rotate) => ({
    animate: {
      y: [0, yOffset, 0],
      x: [0, xOffset, 0],
      rotate: [0, rotate, 0],
    },
    transition: {
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      repeatType: "reverse",
    },
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large faded stomach outline - background element */}
      <motion.div
        className="absolute left-0 bottom-0 w-[500px] h-[500px] opacity-[0.04] text-[#18606D]"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      >
        <StomachOutline />
      </motion.div>

      {/* Second stomach outline - top right */}
      <motion.div
        className="absolute right-0 top-20 w-[350px] h-[350px] opacity-[0.03] text-[#2A7F8F]"
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      >
        <StomachOutline />
      </motion.div>

      {/* Microbiome organic blobs - floating */}
      <motion.div
        className="absolute top-1/4 left-[5%] opacity-[0.06] text-[#18606D]"
        {...floatAnimation(18, -25, 15, 8)}
      >
        <MicrobiomeBlob size={120} opacity={0.6} delay={0} />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-[3%] opacity-[0.05] text-[#2A7F8F]"
        {...floatAnimation(20, 30, -20, -5)}
      >
        <MicrobiomeBlob size={100} opacity={0.5} delay={0} />
      </motion.div>

      <motion.div
        className="absolute top-2/3 left-[15%] opacity-[0.04] text-[#18606D]"
        {...floatAnimation(15, -20, 25, 10)}
      >
        <MicrobiomeBlob size={80} opacity={0.4} delay={0} />
      </motion.div>

      {/* Soft glowing gradient blobs for depth */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-[#18606D]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-[#2A7F8F]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#CFE8EC]/10 rounded-full blur-3xl" />
      
      {/* Subtle organic dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#18606D_0.5px,_transparent_0.5px)] [background-size:32px_32px] opacity-[0.02]" />
    </div>
  );
};
// ========== End Background Visuals ==========

const InsightsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Feature cards data with colorful images
  const features = [
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop",
      title: "AI-Based Analysis",
      description: "Advanced algorithms analyze 50+ gut health markers",
      color: "#18606D",
      gradient: "from-[#18606D]/5 to-[#2A7F8F]/5"
    },
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop",
      title: "Doctor-Recommended Plans",
      description: "Verified by leading gastroenterologists",
      color: "#2A7F8F",
      gradient: "from-[#2A7F8F]/5 to-[#CFE8EC]/5"
    },
    {
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop",
      title: "Natural Solutions",
      description: "Evidence-based dietary and lifestyle interventions",
      color: "#18606D",
      gradient: "from-[#18606D]/5 to-[#2A7F8F]/5"
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
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
      {/* Premium Background Visuals */}
      <BackgroundVisuals />

      {/* Existing Background Elements - kept for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#CFE8EC]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#D9EEF2]/15 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* LEFT SIDE - Product UI Mockup with Colorful Dashboard */}
          <motion.div
            ref={ref}
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative order-2 lg:order-1"
          >
            {/* Main Mockup Container */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#18606D]/5 to-[#2A7F8F]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#D9EEF2] overflow-hidden">
                {/* Mockup Header */}
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
                  {/* User Profile Section with Avatar Image */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#D9EEF2]">
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-[#18606D]/20">
                        <Image
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                          alt="User avatar"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
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

                  {/* Analytics Cards with Colorful Icons */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {[
                      { label: "Gut Diversity", value: "78%", icon: "🦠", trend: "+12%", trendUp: true, bgColor: "from-emerald-100 to-emerald-50" },
                      { label: "Digestion", value: "92%", icon: "🍽️", trend: "+8%", trendUp: true, bgColor: "from-blue-100 to-blue-50" },
                      { label: "Inflammation", value: "31%", icon: "🔥", trend: "-15%", trendUp: false, bgColor: "from-rose-100 to-rose-50" },
                      { label: "Energy Level", value: "76%", icon: "⚡", trend: "+20%", trendUp: true, bgColor: "from-amber-100 to-amber-50" }
                    ].map((metric, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className={`bg-gradient-to-br ${metric.bgColor} rounded-xl p-2.5 sm:p-3 border border-[#D9EEF2] hover:shadow-md transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xl sm:text-2xl">{metric.icon}</span>
                          <span className={`text-[10px] sm:text-xs font-medium ${metric.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {metric.trend}
                          </span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-[#0F172A]">{metric.value}</p>
                        <p className="text-[10px] sm:text-xs text-[#64748B]">{metric.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recommendations Section with Food Image */}
                  <div className="bg-gradient-to-r from-[#CFE8EC]/30 to-[#D9EEF2]/30 rounded-xl p-3 sm:p-4 border border-[#D9EEF2]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=50&h=50&fit=crop"
                          alt="Healthy food"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#0F172A]"> Expert Recommendations</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      🥗 Increase fiber intake • 🥬 Add fermented foods • 🚶 30 min daily walk • 💧 Stay hydrated
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#18606D]/10 to-[#2A7F8F]/10 rounded-full blur-xl" />
              <div className="absolute -bottom-3 -left-3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#2A7F8F]/10 to-[#CFE8EC]/10 rounded-full blur-xl" />
            </div>
          </motion.div>

          {/* RIGHT SIDE - Content with Colorful Feature Images */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="order-1 lg:order-2"
          >
            {/* Section Badge */}
            <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#CFE8EC] rounded-full border border-[#D9EEF2]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18606D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18606D]"></span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#18606D]">Smart Insights</span>
              </span>
            </motion.div>

            {/* Heading */}
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

            {/* Feature Cards Grid with Colorful Images */}
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
                  className={`group relative bg-white rounded-2xl p-4 sm:p-5 border border-[#D9EEF2] hover:border-[#18606D]/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Hover Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    {/* Colorful Image Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden mb-3 sm:mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
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

                  {/* Decorative Line */}
                  <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-full border-b-2 border-r-2 border-[#18606D]/40 rounded-br-lg" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Indicator with Rating Stars */}
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
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs sm:text-sm text-[#64748B] ml-1 font-semibold">4.9/5</span>
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