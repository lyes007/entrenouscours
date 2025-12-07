"use client";

import { useState, useEffect } from "react";

interface BackgroundImageProps {
  src: string;
  mobileSrc?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  children: React.ReactNode;
}

export function BackgroundImage({
  src,
  mobileSrc,
  overlayColor = "#4A70A9",
  overlayOpacity = 0.4,
  children,
}: BackgroundImageProps) {
  const [desktopImageLoaded, setDesktopImageLoaded] = useState(false);
  const [desktopImageError, setDesktopImageError] = useState(false);
  const [mobileImageLoaded, setMobileImageLoaded] = useState(false);
  const [mobileImageError, setMobileImageError] = useState(false);

  useEffect(() => {
    // Preload desktop image
    const desktopLink = document.createElement("link");
    desktopLink.rel = "preload";
    desktopLink.as = "image";
    desktopLink.href = src;
    document.head.appendChild(desktopLink);

    const desktopImg = new Image();
    desktopImg.onload = () => setDesktopImageLoaded(true);
    desktopImg.onerror = () => setDesktopImageError(true);
    desktopImg.src = src;

    // Preload mobile image if provided
    if (mobileSrc) {
      const mobileLink = document.createElement("link");
      mobileLink.rel = "preload";
      mobileLink.as = "image";
      mobileLink.href = mobileSrc;
      document.head.appendChild(mobileLink);

      const mobileImg = new Image();
      mobileImg.onload = () => setMobileImageLoaded(true);
      mobileImg.onerror = () => setMobileImageError(true);
      mobileImg.src = mobileSrc;
    } else {
      // If no mobile image, use desktop image for mobile too
      setMobileImageLoaded(true);
    }

    return () => {
      // Cleanup: remove preload links when component unmounts
      if (document.head.contains(desktopLink)) {
        document.head.removeChild(desktopLink);
      }
      if (mobileSrc) {
        const mobileLink = document.querySelector(`link[href="${mobileSrc}"]`);
        if (mobileLink && document.head.contains(mobileLink)) {
          document.head.removeChild(mobileLink);
        }
      }
    };
  }, [src, mobileSrc]);

  // Convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const desktopImageReady = desktopImageLoaded && !desktopImageError;
  const mobileImageReady = mobileSrc ? (mobileImageLoaded && !mobileImageError) : desktopImageReady;
  const anyImageReady = desktopImageReady || mobileImageReady;

  return (
    <div className="relative min-h-screen">
      {/* Desktop Background Image */}
      <div
        className="hidden sm:block fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          backgroundColor: overlayColor,
          backgroundImage: desktopImageReady ? `url("${src}")` : "none",
          backgroundSize: "150%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          opacity: desktopImageReady ? 1 : 0,
        }}
      >
        {/* Overlay for better text readability */}
        <div
          className="absolute inset-0 backdrop-blur-[1px]"
          style={{
            backgroundColor: hexToRgba(overlayColor, overlayOpacity),
          }}
        />
      </div>

      {/* Mobile Background Image */}
      <div
        className="block sm:hidden fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          backgroundColor: overlayColor,
          backgroundImage: mobileImageReady ? `url("${mobileSrc || src}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          opacity: mobileImageReady ? 1 : 0,
        }}
      >
        {/* Overlay for better text readability */}
        <div
          className="absolute inset-0 backdrop-blur-[1px]"
          style={{
            backgroundColor: hexToRgba(overlayColor, overlayOpacity),
          }}
        />
      </div>

      {/* Fallback background color while loading */}
      {!anyImageReady && (
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundColor: overlayColor,
          }}
        >
          <div
            className="absolute inset-0 backdrop-blur-[1px]"
            style={{
              backgroundColor: hexToRgba(overlayColor, overlayOpacity),
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
