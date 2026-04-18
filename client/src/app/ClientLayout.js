"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import CartSlideOut from "./components/CartSlideOut";



export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    // 1. Check dynamic routes (e.g. /astrologers/chat/123)
   
    // 2. Check exact paths
    [
      "/login",
      "/signup",
      "/admin"

    ].includes(pathname);

    // 1. Check dynamic routes (e.g. /astrologers/chat/123)
   
    // 2. Check exact paths
    [
      "/login/",
      "/admin"
      
    ].includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {!hideNavbar && <CartSlideOut/>}
      
     

      {children}
   
     
    </>
  );
}