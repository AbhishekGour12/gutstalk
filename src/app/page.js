import Image from "next/image";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import InsightsSection from "./components/InsightsSection";
import ProblemSolutionSection from "./components/ProblemSolutionSection";
import ServicesSection from "./components/ServicesSection";
import CallNowSection from "./components/CallNowSection";

export default function Home() {
  return (
   <>
   <Navbar/>
   <HeroSection/>
   <InsightsSection/>
   
  
   </>
  );
}
