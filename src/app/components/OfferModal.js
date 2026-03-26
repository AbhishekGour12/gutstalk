"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaStar, 
  FaClock,
  FaCalendarCheck,
  FaGift,
  FaArrowRight,
  FaBolt
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const OfferModal = ({ onBookNow, onClose: externalOnClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isMounted, setIsMounted] = useState(false);
  const hasShownRef = useRef(false);
  const reopenIntervalRef = useRef(null);

  // Storage keys
  const STORAGE_KEY = 'gutHealthOfferPopup';
  const LAST_SHOWN_KEY = 'gutHealthOfferPopupLastShown';
  const CLOSED_TIMESTAMP_KEY = 'gutHealthOfferPopupClosed';
  const CONVERTED_KEY = `${STORAGE_KEY}_converted`;

  const shouldShowPopup = useCallback(() => {
    try {
      const hasConverted = localStorage.getItem(CONVERTED_KEY);
      if (hasConverted === 'true') return false;

      const closedTimestamp = localStorage.getItem(CLOSED_TIMESTAMP_KEY);
      if (closedTimestamp) {
        const closedTime = parseInt(closedTimestamp, 10);
        const oneMinuteAgo = Date.now() - 60 * 1000;
        if (closedTime > oneMinuteAgo) return false;
      }

      return true;
    } catch (error) {
      return true;
    }
  }, []);

  const saveShownTimestamp = useCallback(() => {
    try {
      localStorage.setItem(LAST_SHOWN_KEY, Date.now().toString());
    } catch (error) {}
  }, []);

  const saveClosedTimestamp = useCallback(() => {
    try {
      localStorage.setItem(CLOSED_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {}
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    saveClosedTimestamp();
    if (externalOnClose) externalOnClose();
  }, [saveClosedTimestamp, externalOnClose]);

  const handleBookNow = useCallback(() => {
    try {
      localStorage.setItem(CONVERTED_KEY, 'true');
    } catch (error) {}
    setIsOpen(false);
    if (onBookNow) onBookNow();
  }, [onBookNow]);

  // Auto close after 20 seconds
  useEffect(() => {
    let autoCloseTimeout;
    if (isOpen) {
      autoCloseTimeout = setTimeout(() => handleClose(), 20000);
    }
    return () => clearTimeout(autoCloseTimeout);
  }, [isOpen, handleClose]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Show popup on mount
  useEffect(() => {
    setIsMounted(true);
    if (hasShownRef.current) return;

    const showTimer = setTimeout(() => {
      if (shouldShowPopup()) {
        setIsOpen(true);
        saveShownTimestamp();
        hasShownRef.current = true;
      }
    }, 2000);

    return () => clearTimeout(showTimer);
  }, [shouldShowPopup, saveShownTimestamp]);

  // Re-open every 1 minute
  useEffect(() => {
    if (reopenIntervalRef.current) clearInterval(reopenIntervalRef.current);

    reopenIntervalRef.current = setInterval(() => {
      if (isOpen) return;
      
      try {
        const hasConverted = localStorage.getItem(CONVERTED_KEY);
        if (hasConverted === 'true') return;
      } catch {}

      if (shouldShowPopup() && !isOpen) {
        setIsOpen(true);
        saveShownTimestamp();
        setTimeLeft(60);
      }
    }, 10000);

    return () => {
      if (reopenIntervalRef.current) clearInterval(reopenIntervalRef.current);
    };
  }, [isOpen, shouldShowPopup, saveShownTimestamp]);

  const formatTime = (seconds) => {
    const secs = seconds % 60;
    return `${secs}s`;
  };

  const modalVariants = {
    hidden: { opacity: 0, x: 50, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 350,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      x: 50, 
      y: 20, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-6 right-6 z-50 w-[280px] sm:w-[320px]"
        >
          <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Top Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#18606D] via-[#2A7F8F] to-[#CFE8EC]" />
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-full transition-all"
            >
              <FaTimes className="w-3 h-3" />
            </button>

            {/* Content - Compact */}
            <div className="p-3">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#18606D] to-[#2A7F8F] flex items-center justify-center shadow-sm">
                    <FaGift className="text-white text-sm" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 rounded-full">
                    <FaBolt className="text-amber-500 w-2.5 h-2.5" />
                    <span className="text-[9px] font-semibold text-amber-700">For You</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mt-0.5">
                    ₹99 Consultation Offer
                  </h3>
                </div>
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-[#18606D]">₹99</span>
                  <span className="text-xs text-gray-400 line-through">₹399</span>
                  <span className="text-[9px] bg-green-50 text-green-600 px-1 py-0.5 rounded">-75%</span>
                </div>
              </div>

             

              {/* Features - Inline */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-[9px] bg-[#CFE8EC]/50 text-[#18606D] px-1.5 py-0.5 rounded-full">✓ Personalized</span>
                <span className="text-[9px] bg-[#CFE8EC]/50 text-[#18606D] px-1.5 py-0.5 rounded-full">✓ Doctor-backed</span>
                <span className="text-[9px] bg-[#CFE8EC]/50 text-[#18606D] px-1.5 py-0.5 rounded-full">✓ 30-day results</span>
              </div>

              {/* Trust */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-[9px] font-medium text-gray-600 ml-0.5">4.8</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdVerified className="w-2.5 h-2.5 text-[#18606D]" />
                  <span className="text-[9px] text-gray-500">10k+ users</span>
                </div>
                <span className="text-[8px] text-gray-400">✨ 1st time</span>
              </div>

              {/* CTA Button */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={pulseAnimation.animate}
                  onClick={handleBookNow}
                  className="flex-1 bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white font-semibold py-1.5 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1 shadow-sm"
                >
                  <FaCalendarCheck className="w-2.5 h-2.5" />
                  Book ₹99
                  <FaArrowRight className="w-2 h-2" />
                </motion.button>
                
                <button
                  onClick={handleClose}
                  className="px-2 py-1.5 text-[9px] text-gray-400 hover:text-gray-500 font-medium"
                >
                  Maybe later
                </button>
              </div>
              
              {/* Small text */}
              <p className="text-center text-[7px] text-gray-300 mt-1.5">
                ⚡ Limited slots • First-time users only
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute -top-1 right-4 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-100" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferModal;