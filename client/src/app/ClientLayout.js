"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import CartSlideOut from "./components/CartSlideOut";
import Footer from "./components/Footer";
import TawkTo from "./components/TwakTo";
import { useCart } from "./context/CartContext";
import { useEffect } from "react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  

  const hiddenRoutes = [
    "/login",
    "/signup",
    "/admin",
    "/privacy-policy",
    "/terms-conditions",
    "/shipping-policy",
    "/refund-policy",
  ];

  const shouldHide = hiddenRoutes.some((route) =>
    pathname.startsWith(route)
  );

 
  return (
    <>
      {!shouldHide && <Navbar />}
      {!shouldHide && <TawkTo />}
      {!shouldHide && <CartSlideOut />}

      {children}

      {!shouldHide && <Footer />}
    </>
  );
}