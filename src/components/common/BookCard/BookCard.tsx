"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Heart, Star, BookOpen, Trash2, Eye } from "lucide-react";
import type { BookItem } from "@/data/books.data";
import { useLibrary } from "@/context/LibraryContext";
import styles from "./BookCard.module.scss";

export interface BookCardProps {
  book: BookItem;
  variant?: "default" | "library";
  showRemoveButton?: boolean;
  onRemove?: (bookId: string) => void;
  onToggleFavorite?: (bookId: string, isFav: boolean) => void;
}

const BookCardComponent: React.FC<BookCardProps> = ({
  book,
  variant = "default",
  showRemoveButton = false,
  onRemove,
  onToggleFavorite,
}) => {
  const { isBookSaved, toggleSaveBook, removeBook } = useLibrary();
  const isFavorite = isBookSaved(book.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveBook(book);
    onToggleFavorite?.(book.id, !isFavorite);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeBook(book.id);
    onRemove?.(book.id);
  };

  const isLibraryVariant = variant === "library" || showRemoveButton;
  const bookDetailsPath = `/categories/${encodeURIComponent(
    book.categorySlug
  )}/${encodeURIComponent(book.slug)}`;

  const reads = book.readsCount || 1250;
  const formattedReads = reads.toLocaleString("en-US");

  return (
    <div
      className={styles.cardContainer}
      aria-label={`كتاب ${book.title} للمؤلف ${book.author}`}
    >
      {/* 1. Compact Cover Box with Poster support and Independent Favorite Button */}
      <div
        className={`${styles.coverBox} ${
          book.coverImage ? styles.hasPoster : ""
        }`}
      >
        {book.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImage}
            alt={book.title}
            className={styles.coverPoster}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholderIconBox} aria-hidden="true">
            <BookOpen size={20} />
          </div>
        )}

        {/* Floating Heart / Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ""}`}
          title={isFavorite ? "إزالة من مكتبتي" : "إضافة إلى مكتبتي"}
          aria-label={isFavorite ? "إزالة من مكتبتي" : "حفظ في مكتبتي"}
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

        {/* 3. Star Rating & Reads/Views Count */}
        <div className={styles.ratingRow}>
          <div className={styles.starRating} aria-label={`تقييم 5 نجوم`}>
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
            <span className={styles.ratingValue}>{book.rating || 5}.0</span>
          </div>

          <div
            className={styles.readsCount}
            title={`${reads.toLocaleString("en-US")} قراءة`}
          >
            <Eye size={12} className={styles.readsIcon} />
            <span>{formattedReads}</span>
          </div>
        </div>
      </div>

      {/* 4. Action Row: Details Button (always visible) + optional Remove in library */}
      <div className={styles.cardActions}>
        <Link
          href={bookDetailsPath}
          className={styles.readNowBtn}
          title="عرض تفاصيل الكتاب"
        >
          <BookOpen size={13} />
          <span>التفاصيل</span>
        </Link>

        {isLibraryVariant && (
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeBtn}
            title="إزالة هذا الكتاب من مكتبتي"
            aria-label="إزالة الكتاب"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export const BookCard = memo(BookCardComponent);
