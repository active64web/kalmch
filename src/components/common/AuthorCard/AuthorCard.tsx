"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import type { AuthorItem } from "@/data/authors.data";
import styles from "./AuthorCard.module.scss";

interface AuthorCardProps {
  author: AuthorItem & { image_url?: string | null };
}

const AuthorCardComponent: React.FC<AuthorCardProps> = ({ author }) => {
  const imageUrl = author.image_url || author.avatar;
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(imageUrl) && !hasError;

  return (
    <Link
      href={`/authors/${encodeURIComponent(author.slug || author.id)}`}
      className={styles.cardWrapper}
      aria-label={`المؤلف ${author.name}`}
    >
      <div className={styles.avatarBox}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={author.name}
            className={styles.avatarImg}
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : (
          <User size={26} color="var(--main_color)" />
        )}
      </div>

      <h4 className={styles.authorName} title={author.name}>
        {author.name}
      </h4>

      <div className={styles.metaRow}>
        <span>{author.country}</span>
        <span className={styles.dot}>•</span>
        <span>{author.ageOrStatus}</span>
      </div>
    </Link>
  );
};

export const AuthorCard = memo(AuthorCardComponent);
