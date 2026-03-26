"use client";
import { useState } from "react";
import Image from "next/image";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import InsightsSection from "./components/InsightsSection";
import ProblemSolutionSection from "./components/ProblemSolutionSection";
import ServicesSection from "./components/ServicesSection";
import CallNowSection from "./components/CallNowSection";
import OfferModal from "./components/OfferModal";

export default function Home() {
   const [showBookingForm, setShowBookingForm] = useState(false);

const handleBookNow = () => {
    // Scroll to booking section or open booking form
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Optional: Track conversion
    console.log('User accepted ₹99 offer from bottom popup');
  };

  const handleModalClose = () => {
    console.log('User dismissed bottom popup');
  };
  return (
   <>
   <Navbar/>
   <HeroSection/>
   <InsightsSection/>
   <ServicesSection/>
  <ProblemSolutionSection/>
      
      {/* Bottom Right Corner Offer Modal */}
      <OfferModal 
        onBookNow={handleBookNow}
        onClose={handleModalClose}
      />
     
  
   </>
  );
}
