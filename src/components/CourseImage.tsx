"use client";

import Image from "next/image";
import { useState } from "react";

interface CourseImageProps {
  imageUrl: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export function CourseImage({
  imageUrl,
  alt = "Image du cours",
  width = 400,
  height = 250,
  className = "",
  priority = false,
  fill = false,
}: CourseImageProps) {
  const [imageError, setImageError] = useState(false);

  // Si pas d'image ou erreur de chargement, afficher le placeholder
  const shouldShowPlaceholder = !imageUrl || imageError;

  if (shouldShowPlaceholder) {
    if (fill) {
      return (
        <div className={`relative overflow-hidden bg-[#EFECE3] ${className}`}>
          <Image
            src="/logo.png"
            alt="Logo placeholder"
            fill
            className="object-contain grayscale opacity-60"
            priority={priority}
          />
        </div>
      );
    }
    return (
      <div
        className={`relative overflow-hidden bg-[#EFECE3] ${className}`}
        style={{ width, height }}
      >
        <Image
          src="/logo.png"
          alt="Logo placeholder"
          width={width}
          height={height}
          className="object-contain grayscale opacity-60"
          priority={priority}
        />
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={imageUrl?.startsWith("/uploads/")}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        onError={() => setImageError(true)}
        priority={priority}
        unoptimized={imageUrl?.startsWith("/uploads/")}
      />
    </div>
  );
}

