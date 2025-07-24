"use client";
import { useState, useEffect } from "react";

export const useMobileHandling = (isDragging, isResizing) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const preventZoom = (e) => {
      if ((isDragging || isResizing) && e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    if (isMobile && (isDragging || isResizing)) {
      document.addEventListener('touchstart', preventZoom, { passive: false });
      document.addEventListener('touchmove', preventZoom, { passive: false });
      
      let viewport = document.querySelector("meta[name=viewport]");
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      
      if (isMobile) {
        let viewport = document.querySelector("meta[name=viewport]");
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
      }
    };
  }, [isDragging, isResizing, isMobile]);

  return { isMobile };
};