"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getAvatarUrl, getInlineInitialsAvatar, AvatarStyle } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
  style?: AvatarStyle;
  className?: string;
  alt?: string;
}

export function Avatar({
  src,
  name,
  size = 32,
  style = "lorelei",
  className,
  alt
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const isUnsplash = typeof src === "string" && src.includes("unsplash.com");
  const initialSrc = (!src || isUnsplash) ? getAvatarUrl(name, style) : src;
  const fallbackSrc = getInlineInitialsAvatar(name);

  const currentSrc = hasError ? fallbackSrc : initialSrc;

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-2xs select-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={currentSrc}
        alt={alt || name || "Avatar"}
        width={size}
        height={size}
        unoptimized
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
