"use client";

import { usePathname } from "next/navigation";
import { BackgroundImage } from "./BackgroundImage";

interface PageBackgroundProps {
  children: React.ReactNode;
}

export function PageBackground({ children }: PageBackgroundProps) {
  const pathname = usePathname();
  
  // Don't apply background on home page
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <BackgroundImage
      src="/download (12).jpg"
      mobileSrc="/download (12) - Copy.jpg"
      overlayColor="#4A70A9"
      overlayOpacity={0.4}
    >
      {children}
    </BackgroundImage>
  );
}

