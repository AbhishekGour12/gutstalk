"use client";

import { useEffect, useRef } from "react";

const ElfsightGoogleReviews = () => {
  const widgetRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Prevent duplicate script loading
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://elfsightcdn.com/platform.js"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Optional: force re-initialization of Elfsight widget (if needed)
    if (window.ElfsightWidget) {
      window.ElfsightWidget.init();
    }
  }, []);

  return (
    <div
      ref={widgetRef}
      className="elfsight-app-1f295003-0856-40af-9a91-0da0f97ce4f6 "
      data-elfsight-app-lazy
    />
  );
};

export default ElfsightGoogleReviews;