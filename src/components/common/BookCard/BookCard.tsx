"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Star, BookOpen } from "lucide-react";
import type { BookItem } from "@/data/books.data";
import styles from "./BookCard.module.scss";

interface BookCardProps {
  book: BookItem;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  return (
    <Link
      href={`/books/${encodeURIComponent(book.slug)}`}
      className={styles.cardContainer}
      aria-label={`كتاب ${book.title} للمؤلف ${book.author}`}
    >
      {/* 1. Compact Cover Box with Unified Placeholder & Heart Button */}
      <div className={styles.coverBox}>
        <div className={styles.placeholderIconBox} aria-hidden="true">
          <BookOpen size={20} />
        </div>

        {/* Favorite Heart Button (Adds to My Library) */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ""}`}
          title={isFavorite ? "إزالة من مكتبتي" : "إضافة إلى مكتبتي"}
          aria-label="حفظ في مكتبتي"
        >
          <Heart
            size={14}
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
          />
        </button>
      </div>

      {/* 2. Book Info */}
      <div className={styles.infoBox}>
        <h4 className={styles.bookTitle} title={book.title}>
          {book.title}
        </h4>
        <p className={styles.authorName} title={book.author}>
          {book.author}
        </p>

        {/* 3. Star Rating */}
        <div className={styles.ratingRow} aria-label={`تقييم ${book.rating} من 5`}>
          <div className={styles.starGroup}>
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={11}
                className={styles.starIcon}
                fill="var(--main_color)"
                color="var(--main_color)"
              />
            ))}
          </div>
          <span className={styles.ratingValue}>{book.rating}.0</span>
        </div>
      </div>
    </Link>
  );
};
