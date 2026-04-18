// components/Hero/FloatingCards.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaSmile, FaStar, FaStethoscope, FaUserMd, FaHeartbeat } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const FloatingCards = () => {
  const cards = [
    {
      icon: FaSmile,
      value: "10K+",
      label: "Happy Clients",
      color: "#2E7D32",
      gradient: "from-[#2E7D32] to-[#66BB6A]",
      delay: 0
    },
    {
      icon: FaStar,
      value: "4.8★",
      label: "Rating",
      color: "#FFB300",
      gradient: "from-[#FFB300] to-[#FFD54F]",
      delay: 0.2,
      subtext: "500+ reviews"
    },
    {
      icon: FaStethoscope,
      value: "Doctor",
      label: "Approved",
      color: "#2E7D32",
      gradient: "from-[#2E7D32] to-[#66BB6A]",
      delay: 0.4
    }
  ];

  // Floating animation variants
  const floatingAnimation = (delay) => ({
    y: [0, -12, 0],
    transition: {
      duration: 3,
      delay: delay,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  });

  return (
    <>
      {/* Desktop Floating Cards */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            animate={floatingAnimation(card.delay)}
            initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5 + card.delay, duration: 0.5 }}
            className={`absolute bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 min-w-[160px] border border-white/20 pointer-events-auto`}
            style={{
              top: `${20 + index * 25}%`,
              right: index % 2 === 0 ? '-20px' : 'auto',
              left: index % 2 !== 0 ? '-20px' : 'auto',
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                <card.icon className="text-white text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                {card.subtext && (
                  <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>
                )}
              </div>
            </div>
            
            {/* Decorative Line */}
            <div className={`absolute -inset-px bg-gradient-to-r ${card.gradient} rounded-2xl opacity-20 blur-sm -z-10`} />
          </motion.div>
        ))}
      </div>

      {/* Mobile Horizontal Cards */}
      <div className="lg:hidden mt-6 flex gap-3 overflow-x-auto pb-4 px-2">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-3 min-w-[140px] flex-shrink-0 border border-gray-100"
          >
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                <card.icon className="text-white text-sm" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-600">{card.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Trust Badge - Desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-full shadow-lg px-4 py-2 hidden lg:flex items-center gap-2 border border-[#C8E6C9]"
      >
        <MdVerified className="text-[#2E7D32] text-lg" />
        <span className="text-sm font-medium text-gray-700">Trusted by medical professionals</span>
        <FaHeartbeat className="text-[#66BB6A] text-sm" />
      </motion.div>
    </>
  );
};

export default FloatingCards;