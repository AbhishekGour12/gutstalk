"use client";
import { motion } from "framer-motion";

export default function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAFB] via-white to-[#E8F4F7] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-[#D9EEF2] p-6 md:p-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D3E] mb-2">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-[#64748B] mb-6">Last updated: {lastUpdated}</p>
          )}
          <div className="prose prose-green max-w-none prose-headings:text-[#1A4D3E] prose-p:text-[#475569] prose-strong:text-[#18606D]">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}