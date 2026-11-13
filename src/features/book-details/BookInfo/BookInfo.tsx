"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Heart,
  FileText,
  Globe,
  Share2,
  Check,
  Eye,
  AlertCircle,
} from "lucide-react";
import type { BookItem } from "@/data/books.data";
import { useLibrary } from "@/context/LibraryContext";
import { recordBookReadAction } from "@/server/actions/book.actions";
import styles from "./BookInfo.module.scss";

interface BookInfoProps {
  book: BookItem;
}

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => {
  const { isBookSaved, toggleSaveBook } = useLibrary();
  const isFavorite = isBookSaved(book.id);
  const [copied, setCopied] = useState(false);
  const [failedCover, setFailedCover] = useState<string | null>(null);
  const [readsCount, setReadsCount] = useState<number>(Number(book.readsCount ?? 0));
  const [hasRecordedRead, setHasRecordedRead] = useState<boolean>(false);
  const [readError, setReadError] = useState<string | null>(null);

  const defaultDescription =
    book.description ||
    `يُعد كتاب "${book.title}" للمؤلف ${book.author} من المؤلفات الروحية والدراسية القيّمة في التراث الكنسي والمكتبة المسيحية. يتناول الكتاب أبعاداً روحية وعقائدية عميقة تهدف إلى بناء الفكر القويم، وترسيخ أصول الحياة الروحية وحياة الصلاة والفضيلة، وتقديم إرشادات نافعة لكل مؤمن يبحث عن النمو الروحي والمعرفة الحقيقية.`;

  const formattedReads = readsCount.toLocaleString("en-US");
  const rawFileUrl = book.pdfUrl?.trim() || "";
  const readerPdfUrl = rawFileUrl
    ? (rawFileUrl.includes("#")
        ? rawFileUrl
        : `${rawFileUrl}#toolbar=0&navpanes=0&zoom=100`)
    : "#";
  const hasCover = Boolean(book.coverImage) && failedCover !== book.coverImage;

  const handleReadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If file_url is missing / null / empty, prevent opening and show error
    if (!rawFileUrl || rawFileUrl === "#") {
      e.preventDefault();
      setReadError(
        "عذراً، الملف الإلكتروني (PDF) لهذا الكتاب غير متوفر للقراءة حالياً، وجاري تجهيزه من قبل إدارة المكتبة."
      );
      return;
    }

    setReadError(null);

    // Only fire POST /api/books/:id/read when user actually reads a valid file
    if (!hasRecordedRead) {
      setHasRecordedRead(true);
      setReadsCount((prev) => prev + 1);

      // 1. Call server action
      recordBookReadAction(book.id).catch(() => {});

      // 2. Direct browser fetch with keepalive as dual guarantee
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://ch-library.eladrabarakelkhyam.com";
      fetch(`${apiUrl}/api/books/${encodeURIComponent(book.id)}/read`, {
        method: "POST",
        headers: { Accept: "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  };

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
          <div
            className={`${styles.coverBox} ${
              hasCover ? styles.hasPoster : ""
            }`}
          >
            {hasCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverImage}
                alt={book.title}
                className={styles.coverPoster}
                onError={() => setFailedCover(book.coverImage || "")}
              />
            ) : (
              <div className={styles.placeholderIconBox} aria-hidden="true">
                <BookOpen size={48} className={styles.bookIcon} />
              </div>
            )}

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

          {/* Reads Row (Rating removed as requested) */}
          <div className={styles.ratingRow}>
            <div
              className={styles.readsCountBadge}
              title={`${formattedReads} مشاهدة ومطالعة`}
            >
              <Eye size={15} className={styles.readsIcon} />
              <span>{formattedReads} مشاهدة</span>
            </div>
          </div>

          {/* Spec Pills (Pages, Language) */}
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
            <a
              href={readerPdfUrl}
              target={rawFileUrl ? "_blank" : undefined}
              rel={rawFileUrl ? "noopener noreferrer" : undefined}
              onClick={handleReadClick}
              className={styles.readNowBtn}
              title={
                rawFileUrl
                  ? "فتح وقراءة الكتاب في تبويب جديد"
                  : "الملف الإلكتروني غير متوفر حالياً"
              }
            >
              <BookOpen size={18} />
              <span>قراءة الكتاب الآن</span>
            </a>

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

          {/* Read Error Message */}
          {readError && (
            <div className={styles.readErrorAlert} role="alert">
              <AlertCircle size={18} className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <strong>غير متوفر للقراءة حالياً</strong>
                <p>{readError}</p>
              </div>
            </div>
          )}
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
