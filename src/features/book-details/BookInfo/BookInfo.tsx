"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  FileText,
  Globe,
  Share2,
  Check,
  Star,
} from "lucide-react";
import type { BookItem } from "@/data/books.data";
import { useLibrary } from "@/context/LibraryContext";
import styles from "./BookInfo.module.scss";

interface BookInfoProps {
  book: BookItem;
}

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => {
  const { isBookSaved, toggleSaveBook } = useLibrary();
  const isFavorite = isBookSaved(book.id);
  const [copied, setCopied] = useState(false);

  const defaultDescription =
    book.description ||
    `يُعد كتاب "${book.title}" للمؤلف ${book.author} من المؤلفات الروحية والدراسية القيّمة في التراث الكنسي والمكتبة المسيحية. يتناول الكتاب أبعاداً روحية وعقائدية عميقة تهدف إلى بناء الفكر القويم، وترسيخ أصول الحياة الروحية وحياة الصلاة والفضيلة، وتقديم إرشادات نافعة لكل مؤمن يبحث عن النمو الروحي والمعرفة الحقيقية.`;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: book.title,
          text: `كتاب ${book.title} للمؤلف ${book.author} على منصة قَلَم`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={styles.bookInfoWrapper}>
      {/* 1. Main Details Card */}
      <div className={styles.detailsCard}>
        {/* Cover Section */}
        <div className={styles.coverColumn}>
          <div className={styles.coverBox}>
            <div className={styles.placeholderIconBox} aria-hidden="true">
              <BookOpen size={48} className={styles.bookIcon} />
            </div>

            {/* Quick Favorite Icon on Cover */}
            <button
              type="button"
              onClick={() => toggleSaveBook(book)}
              className={`${styles.favoriteCircle} ${
                isFavorite ? styles.active : ""
              }`}
              title={isFavorite ? "إزالة من مكتبتي" : "حفظ في مكتبتي"}
              aria-label="حفظ في مكتبتي"
            >
              <Heart
                size={18}
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
              />
            </button>
          </div>
        </div>

        {/* Info Column */}
        <div className={styles.infoColumn}>
          {/* Category Pill */}
          <div className={styles.categoryBadge}>
            <span>{book.category}</span>
          </div>

          {/* Title & Author */}
          <h1 className={styles.bookTitle}>{book.title}</h1>
          <p className={styles.authorRow}>
            <span>المؤلف:</span>
            <strong>{book.author}</strong>
          </p>

          {/* Star Rating Row */}
          <div
            className={styles.ratingRow}
            aria-label={`تقييم ${book.rating || 5} من 5 نجوم`}
          >
            <div className={styles.starGroup}>
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  className={styles.starIcon}
                  fill="var(--main_color)"
                  color="var(--main_color)"
                />
              ))}
            </div>
            <span className={styles.ratingValue}>{book.rating || 5}.0</span>
          </div>

          {/* Spec Pills (Pages, Language) - Format box removed as requested */}
          <div className={styles.specPillsGrid}>
            <div className={styles.specPill}>
              <FileText size={15} className={styles.pillIcon} />
              <div className={styles.specContent}>
                <span className={styles.specLabel}>عدد الصفحات</span>
                <span className={styles.specValue}>
                  {book.pagesCount || 192} صفحة
                </span>
              </div>
            </div>

            <div className={styles.specPill}>
              <Globe size={15} className={styles.pillIcon} />
              <div className={styles.specContent}>
                <span className={styles.specLabel}>اللغة</span>
                <span className={styles.specValue}>العربية</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className={styles.actionsBar}>
            <Link
              href={`/categories/${encodeURIComponent(
                book.categorySlug
              )}/${encodeURIComponent(book.slug)}/read`}
              className={styles.readNowBtn}
              title="ابدأ قراءة الكتاب عبر عارض الـ PDF في المتصفح"
            >
              <BookOpen size={18} />
              <span>قراءة الكتاب الآن</span>
            </Link>

            <button
              type="button"
              onClick={() => toggleSaveBook(book)}
              className={`${styles.favoriteToggleBtn} ${
                isFavorite ? styles.favorited : ""
              }`}
              title="حفظ الكتاب في مكتبتي"
            >
              {isFavorite ? (
                <>
                  <Check size={16} />
                  <span>محفوظ في مكتبتي</span>
                </>
              ) : (
                <>
                  <Heart size={16} />
                  <span>إضافة إلى مكتبتي</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className={`${styles.shareBtn} ${copied ? styles.copied : ""}`}
              title={copied ? "تم نسخ الرابط!" : "مشاركة رابط الكتاب"}
              aria-label="مشاركة رابط الكتاب"
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              <span className={styles.shareText}>
                {copied ? "تم النسخ" : "مشاركة"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. About the Book Section */}
      <div className={styles.aboutCard}>
        <h2 className={styles.sectionHeading}>نبذة عن الكتاب</h2>
        <div className={styles.descriptionBody}>
          <p>{defaultDescription}</p>
        </div>
      </div>
    </div>
  );
};
