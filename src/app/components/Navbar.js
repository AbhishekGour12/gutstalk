"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiPhone, 
  FiCalendar, 
  FiHome, 
  FiActivity, 
  FiDroplet, 
  FiFileText, 
  FiUser, 
  FiMail,
  FiChevronRight,
  FiStar,
  FiShield,
  FiHeart
} from 'react-icons/fi';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const CustomSkinIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2C8 6 6 10 6 14a6 6 0 0012 0c0-4-2-8-6-12z" />
    </svg>
  );
  
  const StomachIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2c1 3-1 5-1 7 0 2 2 3 4 3 3 0 5 2 5 5a5 5 0 01-10 0c0-2 1-3 2-4" />
    </svg>
  );
  
  const HealthIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-6-4.35-9-8.5C1 9 3 5 7 5c2 0 3 1 5 3 2-2 3-3 5-3 4 0 6 4 4 7.5C18 16.65 12 21 12 21z" />
    </svg>
  );
  
  const LeafIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16z" />
      <path d="M4 20c4-4 8-8 16-16" />
    </svg>
  );
  
  // Navigation links data
  const navLinks = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'Gut Test', href: '/gut-test', icon: StomachIcon },
    { name: 'Skin Test', href: '/skin-test', icon: CustomSkinIcon },
    { name: 'Plans', href: '/plans', icon: FiFileText },
    { name: 'About', href: '/about', icon: FiUser },
    { name: 'Contact', href: '/contact', icon: FiMail },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => router.pathname === path;

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed h-[90px] top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-[#D9EEF2]'
            : 'bg-white/90 backdrop-blur-sm border-b border-[#D9EEF2]/50'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full my-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex relative items-center gap-2 cursor-pointer group"
            >
              <div className="flex items-center h-[60px] max-md:h-[40px]">
                <Image
                  src="/logo.png"
                  alt="GutCare+ Logo"
                  width={120}
                  height={50}
                  priority
                  className="h-full w-auto object-contain"
                />
              </div>
              
              {/* Limited Offer Badge - Teal Theme */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="hidden lg:block ml-2"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#CFE8EC] rounded-full blur-sm" />
                  <div className="relative bg-[#CFE8EC] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#18606D] whitespace-nowrap flex items-center gap-1">
                    <FiStar className="text-[10px]" />
                    Limited ₹99 Offer
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Desktop Navigation Links - Teal Theme */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive(link.href)
                        ? 'text-[#18606D]'
                        : 'text-[#64748B] hover:text-[#18606D]'
                    }`}
                  >
                    {link.name}
                  </Link>
                  
                  {/* Active Indicator - Teal */}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover Underline - Teal */}
                  {!isActive(link.href) && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] rounded-full origin-left"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Desktop CTA Buttons - Teal Theme */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden px-4 py-2 rounded-xl border-2 border-[#18606D] text-[#18606D] hover:text-white transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2 text-sm font-semibold">
                  <FiPhone className="text-sm" />
                  Call Now
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(24, 96, 109, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white px-5 py-2 rounded-xl shadow-md overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 text-sm font-semibold">
                  <FiCalendar className="text-sm" />
                  Book ₹99 Call
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button - Teal Theme */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg bg-[#F4FAFB] hover:bg-[#CFE8EC] transition-colors"
            >
              <FiMenu className="text-2xl text-[#18606D]" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            />
            
            {/* Slide-in Menu - Teal Theme */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* Menu Header - Teal Theme */}
              <div className="sticky top-0 bg-white border-b border-[#D9EEF2] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#18606D] to-[#2A7F8F] p-2.5 rounded-xl shadow-lg">
                    <HealthIcon className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A]">
                      GutTalks<span className="text-[#18606D]">+</span>
                    </h2>
                    <p className="text-xs text-[#64748B]">Personalized Gut Health</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-[#F4FAFB] hover:bg-[#CFE8EC] transition-colors"
                >
                  <FiX className="text-xl text-[#18606D]" />
                </motion.button>
              </div>

              {/* Navigation Links - Teal Theme */}
              <div className="p-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-[#18606D]/10 to-[#2A7F8F]/10 text-[#18606D] border border-[#18606D]/20'
                          : 'hover:bg-[#F4FAFB] text-[#64748B]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className={`text-xl ${isActive(link.href) ? 'text-[#18606D]' : 'text-[#94A3B8]'}`} />
                        <span className="font-medium">{link.name}</span>
                      </div>
                      {isActive(link.href) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#18606D]"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile CTA Section - Teal Theme */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-[#D9EEF2]">
                <div className="space-y-3">
                  {/* Limited Offer Badge - Teal Theme */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-2 mb-2"
                  >
                    <div className="bg-[#CFE8EC] px-3 py-1.5 rounded-full">
                      <span className="text-xs font-bold text-[#18606D] flex items-center gap-1">
                        <FiStar className="text-xs" />
                        🔥 Limited Time ₹99 Offer
                      </span>
                    </div>
                  </motion.div>
                  
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 group hover:shadow-xl transition-shadow"
                  >
                    <FiCalendar className="text-lg" />
                    <span className="font-semibold">Book ₹99 Consultation</span>
                    <FiChevronRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="w-full border-2 border-[#18606D] text-[#18606D] px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#F4FAFB] transition-colors"
                  >
                    <FiPhone className="text-lg" />
                    <span className="font-semibold">Call Now for Free Consultation</span>
                  </motion.button>
                  
                  {/* Trust Badge - Teal Theme */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-3 pt-4"
                  >
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] border-2 border-white flex items-center justify-center shadow-sm">
                          <LeafIcon className="text-white text-[10px]" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">
                      <FiHeart className="text-[#18606D] text-xs" />
                      Trusted by 10,000+ patients
                    </p>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">
                      <FiShield className="text-[#18606D] text-xs" />
                      Expert Verified
                    </p>
                  </motion.div>
                  
                  {/* Additional Trust Message */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="text-center text-[10px] text-[#94A3B8] pt-2"
                  >
                    ⭐ 4.8 ★ 500+ Google Reviews
                  </motion.p>
                </div>
              </div>
              
              {/* Add padding for bottom CTA */}
              <div className="h-56" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under navbar */}
      <div className="h-[90px]" />
    </>
  );
};

export default Navbar;