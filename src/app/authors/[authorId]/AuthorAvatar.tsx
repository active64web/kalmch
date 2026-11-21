"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import styles from "./AuthorDetails.module.scss";

interface AuthorAvatarProps {
  imageUrl?: string | null;
  name: string;
}

export function AuthorAvatar({ imageUrl, name }: AuthorAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(imageUrl) && !hasError;

  return (
    <div className={styles.avatarBox} aria-label={`صورة ${name}`}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl!}
          alt={name}
          className={styles.avatarImg}
          onError={() => setHasError(true)}
          loading="eager"
        />
      ) : (
        <User
          size={64}
          color="var(--main_color)"
          className={styles.avatarPlaceholderIcon}
        />
      )}
    </div>
  );
}
