// app/contact/page.jsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiMapPin, FiPhone, FiMail, FiClock, FiSend, 
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin, 
  FiMessageCircle, FiCheckCircle, FiAlertCircle 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    { icon: FiMapPin, title: "Visit Us", details: "123 Gut Health Street, Wellness City, IN 560001" },
    { icon: FiPhone, title: "Call Us", details: "+91 98765 43210", link: "tel:+919876543210" },
    { icon: FiMail, title: "Email Us", details: "hello@guttalks.com", link: "mailto:hello@guttalks.com" },
    { icon: FiClock, title: "Working Hours", details: "Mon–Sat: 9:00 AM – 7:00 PM IST" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: FiFacebook, url: "https://facebook.com/guttalks", color: "#1877F2" },
    { name: "Instagram", icon: FiInstagram, url: "https://instagram.com/guttalks", color: "#E4405F" },
    { name: "Twitter", icon: FiTwitter, url: "https://twitter.com/guttalks", color: "#1DA1F2" },
    { name: "LinkedIn", icon: FiLinkedin, url: "https://linkedin.com/company/guttalks", color: "#0077B5" },
    { name: "WhatsApp", icon: FaWhatsapp, url: "https://wa.me/919876543210", color: "#25D366" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAFB] via-white to-[#E8F4F7]">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#18606D]/5 to-[#2A7F8F]/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#1A4D3E] mb-4"
          >
            Let's Talk Gut Health
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#64748B] max-w-2xl mx-auto"
          >
            Have questions? Need guidance? We're here to help you on your gut wellness journey.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-md border border-[#D9EEF2] hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-full bg-[#E8F4F7] flex items-center justify-center mx-auto mb-4 text-[#18606D]">
                <info.icon size={24} />
              </div>
              <h3 className="font-bold text-[#1A4D3E] mb-2">{info.title}</h3>
              {info.link ? (
                <a href={info.link} className="text-[#64748B] text-sm hover:text-[#18606D] transition">
                  {info.details}
                </a>
              ) : (
                <p className="text-[#64748B] text-sm">{info.details}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form + Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-[#D9EEF2] p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-[#1A4D3E] mb-2">Send us a message</h2>
            <p className="text-[#64748B] mb-6">We'll respond within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A4D3E] mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A4D3E] mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A4D3E] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A4D3E] mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A4D3E] mb-1">Message *</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#D9EEF2] rounded-xl focus:ring-2 focus:ring-[#18606D] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Map & Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Map (Google Maps embed) */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#D9EEF2] overflow-hidden">
              <div className="h-64 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.045801777193!2d77.59423077512218!3d12.971599687324045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1713435678901!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GutTalks Location"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#D9EEF2] p-6">
              <h3 className="text-xl font-bold text-[#1A4D3E] mb-4">Connect With Us</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4FAFB] border border-[#D9EEF2] text-[#1A4D3E] hover:shadow-md transition"
                    style={{ hover: { color: social.color } }}
                  >
                    <social.icon size={18} style={{ color: social.color }} />
                    <span className="text-sm font-medium">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-[#18606D] to-[#2A7F8F] rounded-2xl p-6 text-white text-center">
              <FaWhatsapp size={32} className="mx-auto mb-2" />
              <h3 className="text-xl font-bold mb-1">Chat on WhatsApp</h3>
              <p className="text-sm opacity-90 mb-3">Quick replies, 9 AM – 7 PM</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#18606D] px-5 py-2 rounded-xl font-semibold hover:shadow-lg transition"
              >
                Start Chat
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Hint */}
      <div className="text-center py-10 text-[#64748B] text-sm">
        <p>Have more questions? Check our <a href="/faq" className="text-[#18606D] font-medium hover:underline">FAQ page</a> or call us directly.</p>
      </div>
    </div>
  );
}