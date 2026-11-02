"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star, BookOpen, Trash2 } from "lucide-react";
import type { BookItem } from "@/data/books.data";
import { useLibrary } from "@/context/LibraryContext";
import styles from "./BookCard.module.scss";

export interface BookCardProps {
  book: BookItem;
  variant?: "default" | "library";
  showReadAction?: boolean;
  showRemoveButton?: boolean;
  onRemove?: (bookId: string) => void;
  onToggleFavorite?: (bookId: string, isFav: boolean) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  variant = "default",
  showReadAction = false,
  showRemoveButton = false,
  onRemove,
  onToggleFavorite,
}) => {
  const router = useRouter();
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

  const handleReadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/reader/${book.id}`);
  };

  const isLibraryVariant = variant === "library" || showReadAction || showRemoveButton;

  return (
    <Link
      href={`/books/${encodeURIComponent(book.slug)}`}
      className={`${styles.cardContainer} ${isLibraryVariant ? styles.libraryCard : ""}`}
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

      {/* 4. Optional Library Mode Actions (Read Now + Remove) */}
      {isLibraryVariant && (
        <div className={styles.libraryActions}>
          <button
            type="button"
            onClick={handleReadClick}
            className={styles.readNowBtn}
            title="ابدأ قراءة الكتاب الآن"
          >
            <BookOpen size={13} />
            <span>اقرأ الآن</span>
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeBtn}
            title="إزالة هذا الكتاب من مكتبتي"
            aria-label="إزالة الكتاب"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </Link>
  );
};
