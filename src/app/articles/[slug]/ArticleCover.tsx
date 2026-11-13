"use client";

import React, { useState } from "react";
import { ScrollText } from "lucide-react";
import styles from "./ArticleDetails.module.scss";

interface ArticleCoverProps {
  coverImage?: string;
  title: string;
}

export function ArticleCover({ coverImage, title }: ArticleCoverProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(coverImage) && !hasError;

  return (
    <div
      className={`${styles.coverBox} ${showImage ? styles.hasPoster : ""}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={title}
          className={styles.coverPoster}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={styles.placeholderIconBox} aria-hidden="true">
          <ScrollText size={38} className={styles.coverIcon} />
        </div>
      )}
    </div>
  );
}

