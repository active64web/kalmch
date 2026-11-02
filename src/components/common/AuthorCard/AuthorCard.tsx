import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import type { AuthorItem } from "@/data/authors.data";
import styles from "./AuthorCard.module.scss";

interface AuthorCardProps {
  author: AuthorItem;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  return (
    <Link
      href={`/authors?author=${encodeURIComponent(author.slug)}`}
      className={styles.cardWrapper}
      aria-label={`المؤلف ${author.name}`}
    >
      <div className={styles.avatarBox}>
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            sizes="64px"
            className={styles.avatarImg}
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

