// components/MarqueeBanner.jsx
"use client";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Apple,
  Microscope,
  Users,
  FileText,
  HeartPulse,
  Shield,
  Brain,
} from "lucide-react";

const Banners = () => {
  const items = [
    { icon: FlaskConical, text: "Gut Health Test", color: "#18606D" },
    { icon: Apple, text: "Food Intolerance", color: "#2A7F8F" },
    { icon: Microscope, text: "Microbiome Analysis", color: "#0D9488" },
    { icon: Users, text: "Expert Consultation", color: "#18606D" },
    { icon: FileText, text: "Personalized Reports", color: "#2A7F8F" },
    { icon: HeartPulse, text: "Digestive Wellness", color: "#E67E22" },
    { icon: Shield, text: "Immunity Support", color: "#0D9488" },
    { icon: Brain, text: "AI Health Insights", color: "#E67E22" },
  ];

  // Duplicate to create seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className="w-full py-4 md:py-6  overflow-hidden bg-gradient-to-b from-[#F4FAFB] to-white">
      
      {/* Marquee wrapper with overflow hidden */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-4 md:gap-6 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
          style={{ animationPlayState: "running" }}
        >
          {duplicatedItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3  hover:shadow-md transition-all"
            >
              <item.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: item.color }} />
              <span className="text-sm md:text-base font-medium text-[#1A4D3E] whitespace-nowrap">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Banners;