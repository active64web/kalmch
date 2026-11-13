"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { Heart, BookOpen, Trash2, Eye } from "lucide-react";
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
  const [failedCover, setFailedCover] = useState<string | null>(null);

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
  const categorySlug = book.categorySlug || "general";
  const bookDetailsPath = `/categories/${encodeURIComponent(
    categorySlug
  )}/${encodeURIComponent(book.id)}`;

  const reads = Number(book.readsCount ?? 0);
  const formattedReads = reads.toLocaleString("en-US");
  const hasCover = Boolean(book.coverImage) && failedCover !== book.coverImage;

  return (
    <div
      className={styles.cardContainer}
      aria-label={`كتاب ${book.title} للمؤلف ${book.author}`}
    >
      {/* 1. Compact Cover Box with Poster support, fallback onError and Independent Favorite Button */}
      <div
        className={`${styles.coverBox} ${
          hasCover ? styles.hasPoster : ""
        }`}
      >
        <Link
          href={bookDetailsPath}
          className={styles.coverLink}
          title={`عرض تفاصيل كتاب ${book.title}`}
        >
          {hasCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverImage}
              alt={book.title}
              className={styles.coverPoster}
              loading="lazy"
              onError={() => setFailedCover(book.coverImage || "")}
            />
          ) : (
            <div className={styles.placeholderIconBox} aria-hidden="true">
              <BookOpen size={20} />
            </div>
          )}
        </Link>

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
          <Link href={bookDetailsPath} className={styles.titleLink}>
            {book.title}
          </Link>
        </h4>

        <p className={styles.authorName} title={book.author}>
          {book.author}
        </p>

        {/* 3. Reads / Views Count (Rating removed as requested) */}
        <div className={styles.ratingRow}>
          <div
            className={styles.readsCount}
            title={`${formattedReads} مشاهدة`}
          >
            <Eye size={12} className={styles.readsIcon} />
            <span>{formattedReads} مشاهدة</span>
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
