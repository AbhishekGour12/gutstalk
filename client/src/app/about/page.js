// app/about/page.jsx
"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  FaCalendarCheck, FaCreditCard, FaUserEdit, FaVideo, FaMicrophoneAlt,
  FaShieldAlt, FaHeartbeat, FaLeaf, FaUsers, FaSmile, FaClock, 
  FaStar, FaQuoteLeft, FaArrowRight, FaCheckCircle, FaAward
} from "react-icons/fa";

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [inView, setInView] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll('.section-fade').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stats = [
    { value: "1000+", label: "Consultations", icon: FaUsers },
    { value: "95%", label: "Satisfaction", icon: FaSmile },
    { value: "50+", label: "Certified Experts", icon: FaAward },
    { value: "24/7", label: "Support", icon: FaClock }
  ];

  const values = [
    { title: "Expert Guidance", desc: "Certified gut health specialists", icon: FaMicrophoneAlt, color: "#18606D" },
    { title: "Personalized Care", desc: "Tailored plans for your needs", icon: FaHeartbeat, color: "#2A7F8F" },
    { title: "Trust & Transparency", desc: "Honest recommendations", icon: FaShieldAlt, color: "#0f766e" },
    { title: "Fast & Easy Booking", desc: "Schedule in minutes", icon: FaCalendarCheck, color: "#0891b2" }
  ];

  const steps = [
    { num: 1, title: "Choose Slot", desc: "Pick a convenient time", icon: FaCalendarCheck },
    { num: 2, title: "Make Payment", desc: "Secure ₹99 payment", icon: FaCreditCard },
    { num: 3, title: "Fill Details", desc: "Share your symptoms", icon: FaUserEdit },
    { num: 4, title: "Get Meeting Link", desc: "Zoom link via email", icon: FaVideo },
    { num: 5, title: "Consult Expert", desc: "30-min session", icon: FaMicrophoneAlt }
  ];

  const testimonials = [
    { name: "Priya Sharma", rating: 5, text: "I've struggled with bloating for years. Guttalks gave me clarity and a plan that actually works!", avatar: "/avatars/priya.jpg" },
    { name: "Rahul Mehta", rating: 5, text: "The consultation was smooth. The expert listened carefully and provided actionable steps. Highly recommended.", avatar: "/avatars/rahul.jpg" },
    { name: "Anita Desai", rating: 5, text: "Finally, a platform that understands gut health! The Zoom call was easy, and I feel so much better.", avatar: "/avatars/anita.jpg" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4FAFB] via-white to-[#E8F4F7]">
      {/* Hero Section with parallax */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1920&h=1080&fit=crop"
            alt="Gut health consultation"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <motion.div style={{ opacity }} className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-bold mb-4">
            We Don’t Just Fix Gut Health — We Transform Lives
          </motion.h1>
          <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-lg md:text-xl text-gray-200 mb-8">
            Expert guidance, personalized plans, and a community that cares – all from the comfort of your home.
          </motion.p>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Link href="/products" className="inline-block bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
              Book Your Consultation
            </Link>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center"><div className="w-1 h-2 bg-white rounded-full mt-2"></div></div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="section-fade py-20 px-4 max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate={inView.story ? "visible" : "hidden"} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D3E] mb-4">Our Story</h2>
          <div className="w-20 h-1 bg-[#18606D] mx-auto rounded-full mb-6"></div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" animate={inView.story ? "visible" : "hidden"}>
            <p className="text-[#1A4D3E] text-lg leading-relaxed mb-4">
              Guttalks was born from a simple observation: millions of Indians struggle with digestive issues but have nowhere to turn. 
              Long waiting lists, generic advice, and expensive treatments often leave people feeling lost.
            </p>
            <p className="text-[#1A4D3E] text-lg leading-relaxed mb-4">
              We set out to change that. By connecting you with certified gut health experts through an easy online platform, 
              we provide personalized care that fits your lifestyle.
            </p>
            <p className="text-[#1A4D3E] text-lg leading-relaxed">
              Today, Guttalks is trusted by thousands to restore their gut health, boost energy, and reclaim their lives.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate={inView.story ? "visible" : "hidden"} className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
            <Image src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop" alt="Story" fill className="object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gradient-to-r from-[#18606D]/10 to-[#2A7F8F]/10 py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-8 shadow-md border border-[#D9EEF2] text-center">
            <div className="w-16 h-16 bg-[#18606D]/20 rounded-full flex items-center justify-center mx-auto mb-4"><FaLeaf className="text-[#18606D] text-2xl" /></div>
            <h3 className="text-2xl font-bold text-[#1A4D3E] mb-3">Our Mission</h3>
            <p className="text-[#64748B]">Make gut health accessible, understandable, and actionable for everyone – no matter where you live.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-8 shadow-md border border-[#D9EEF2] text-center">
            <div className="w-16 h-16 bg-[#2A7F8F]/20 rounded-full flex items-center justify-center mx-auto mb-4"><FaHeartbeat className="text-[#2A7F8F] text-2xl" /></div>
            <h3 className="text-2xl font-bold text-[#1A4D3E] mb-3">Our Vision</h3>
            <p className="text-[#64748B]">Become India’s most trusted gut health platform, empowering millions to live healthier, happier lives.</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D3E] mb-4">Our Core Values</h2>
          <p className="text-[#64748B] max-w-2xl mx-auto">The principles that guide everything we do.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} whileHover={{ y: -8 }} className="bg-white rounded-xl p-6 text-center shadow-md border border-[#D9EEF2] hover:shadow-lg transition">
              <div className="w-14 h-14 rounded-full bg-[#E8F4F7] flex items-center justify-center mx-auto mb-4" style={{ color: value.color }}><value.icon size={28} /></div>
              <h3 className="font-bold text-xl text-[#1A4D3E] mb-2">{value.title}</h3>
              <p className="text-[#64748B] text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D3E] mb-4">How It Works</h2>
            <p className="text-[#64748B]">Get started in 5 simple steps</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="relative text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#18606D] to-[#2A7F8F] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-md">{step.num}</div>
                <div className="text-lg font-semibold text-[#1A4D3E] mb-1">{step.title}</div>
                <p className="text-sm text-[#64748B]">{step.desc}</p>
                {idx < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-[#D9EEF2] -z-10"></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us (Stats) */}
      <section className="bg-gradient-to-r from-[#18606D] to-[#2A7F8F] py-16 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}>
                <stat.icon className="text-4xl mx-auto mb-3 text-[#CFE8EC]" />
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop" alt="Expert consultation" fill className="object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D3E] mb-4">Meet Our Experts</h2>
            <p className="text-[#64748B] text-lg mb-6">Our team includes certified nutritionists, gut health specialists, and lifestyle coaches dedicated to your well‑being.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><FaCheckCircle className="text-[#18606D]" /> <span>Certified in Clinical Nutrition</span></li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-[#18606D]" /> <span>10+ years of experience</span></li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-[#18606D]" /> <span>Personalised diet & lifestyle plans</span></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F4FAFB] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D3E] mb-4">Loved by Thousands</h2>
            <p className="text-[#64748B]">Real stories from real people</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="bg-white rounded-2xl p-6 shadow-md border border-[#D9EEF2]">
                <FaQuoteLeft className="text-[#18606D]/30 text-2xl mb-3" />
                <p className="text-[#1A4D3E] mb-4 italic">{t.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#E8F4F7] flex items-center justify-center"><FaUsers className="text-[#18606D]" /></div>
                  <div>
                    <div className="font-semibold text-[#1A4D3E]">{t.name}</div>
                    <div className="flex gap-1"><FaStar className="text-amber-400" /><span className="text-sm text-[#64748B]">{t.rating}.0</span></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto bg-gradient-to-r from-[#18606D] to-[#2A7F8F] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Gut Healing Journey Today</h2>
          <p className="text-lg mb-6 opacity-90">Join thousands who have transformed their health with expert guidance.</p>
          <Link href="/products">
            <button className="bg-white text-[#18606D] px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2 mx-auto">
              Book Now <FaArrowRight />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}