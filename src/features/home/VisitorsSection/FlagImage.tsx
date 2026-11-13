"use client";

import React, { useState } from "react";

interface FlagImageProps {
  flagUrl?: string;
  code: string;
  name: string;
  flagEmoji?: string;
  className?: string;
}

export function FlagImage({
  flagUrl,
  code,
  name,
  flagEmoji,
  className,
}: FlagImageProps) {
  const [hasError, setHasError] = useState(false);
  const src = flagUrl || `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

  if (hasError && flagEmoji) {
    return (
      <span style={{ fontSize: "20px", lineHeight: 1 }} aria-hidden="true">
        {flagEmoji}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`علم ${name}`}
      width={40}
      height={28}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

