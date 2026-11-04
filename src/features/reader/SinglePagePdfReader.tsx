"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import type { BookItem } from "@/data/books.data";
import { useLibrary } from "@/context/LibraryContext";
import styles from "./PdfReaderView.module.scss";

interface SinglePagePdfReaderProps {
  book: BookItem;
}

export const SinglePagePdfReader: React.FC<SinglePagePdfReaderProps> = ({
  book,
}) => {
  const { isBookSaved, toggleSaveBook } = useLibrary();
  const isFavorite = isBookSaved(book.id);

  const totalPages = book.pagesCount || 129;
  const [page, setPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>("1");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Detect mobile (screen width <= 768px or mobile devices)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        window.innerWidth <= 768 ||
        /android|iphone|ipad|ipod/i.test(navigator.userAgent)
      );
    }
    return false;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          /android|iphone|ipad|ipod/i.test(navigator.userAgent)
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToPage = useCallback(
    (target: number) => {
      const validPage = Math.max(1, Math.min(target, totalPages));
      if (validPage !== page) {
        setIsLoading(true);
        setPage(validPage);
        setPageInput(validPage.toString());
      }
    },
    [page, totalPages]
  );

  const nextPage = () => {
    goToPage(page + 1);
  };

  const prevPage = () => {
    goToPage(page - 1);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed)) {
      goToPage(parsed);
    } else {
      setPageInput(page.toString());
    }
  };

  // Keyboard navigation on desktop: Left Arrow = Next page, Right Arrow = Previous page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key === "ArrowLeft") {
        goToPage(page + 1);
      } else if (e.key === "ArrowRight") {
        goToPage(page - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, goToPage]);

  // Loading safety fallback so it never hangs
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [page]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const fullPdfUrl = book.pdfUrl || "/hatshepsut-novel.pdf";
  // External link with hidden toolbars
  const externalViewUrl = `${fullPdfUrl}#toolbar=0&navpanes=0`;
  // On desktop: full book with normal continuous scroll (scrollbar=1) and FitH
  const desktopPdfUrl = `${fullPdfUrl}#page=${page}&view=FitH&toolbar=0&navpanes=0&scrollbar=1`;

  return (
    <div
      ref={containerRef}
      className={`${styles.readerWrapper} ${
        isFullscreen ? styles.fullscreenMode : ""
      }`}
    >
      {/* 1. Header Toolbar */}
      <header className={styles.readerToolbar}>
        <div className={styles.toolbarStart}>
          <Link
            href={`/categories/${encodeURIComponent(
              book.categorySlug
            )}/${encodeURIComponent(book.slug)}`}
            className={styles.backLink}
            title="الرجوع لصفحة الكتاب"
          >
            <ArrowRight size={16} />
            <span>تفاصيل الكتاب</span>
          </Link>

          <div className={styles.bookMetaHeader}>
            <h1 className={styles.headerTitle}>{book.title}</h1>
            <span className={styles.headerAuthor}>— {book.author}</span>
          </div>
        </div>

        <div className={styles.toolbarActions}>
          {/* Page Navigation Controls on Desktop */}
          {!isMobile && (
            <div className={styles.pageNavigator} title="تقليب صفحات الكتاب">
              <button
                type="button"
                onClick={prevPage}
                disabled={page <= 1}
                className={styles.pageNavBtn}
                title="الصفحة السابقة"
                aria-label="الانتقال إلى الصفحة السابقة"
              >
                <ChevronRight size={16} />
                <span className={styles.pageNavText}>السابقة</span>
              </button>

              <form
                onSubmit={handlePageInputSubmit}
                className={styles.pageIndicator}
              >
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={handlePageInputSubmit}
                  className={styles.pageInput}
                  aria-label="رقم الصفحة الحالية"
                />
                <span className={styles.totalPagesLabel}>/ {totalPages}</span>
              </form>

              <button
                type="button"
                onClick={nextPage}
                disabled={page >= totalPages}
                className={styles.pageNavBtn}
                title="الصفحة التالية"
                aria-label="الانتقال إلى الصفحة التالية"
              >
                <span className={styles.pageNavText}>التالية</span>
                <ChevronLeft size={16} />
              </button>
            </div>
          )}

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => toggleSaveBook(book)}
            className={`${styles.toolBtn} ${
              isFavorite ? styles.favorited : ""
            }`}
            title={isFavorite ? "إزالة من مكتبتي" : "حفظ في مكتبتي"}
          >
            <Heart
              size={16}
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
            />
            <span className={styles.btnLabel}>
              {isFavorite ? "في مكتبتي" : "حفظ"}
            </span>
          </button>

          {/* Direct Open in external tab */}
          <a
            href={externalViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.toolBtn}
            title="فتح الكتاب كاملاً في نافذة خارجية مع التمرير"
            aria-label="فتح الكتاب كاملاً في نافذة خارجية مع التمرير"
          >
            <ExternalLink size={15} />
            <span className={styles.btnLabel}>فتح الكتاب كاملاً</span>
          </a>

          {/* Fullscreen Toggle - Desktop only */}
          {!isMobile && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`${styles.toolBtn} ${styles.fullscreenBtn}`}
              title={isFullscreen ? "إنهاء وضع ملء الشاشة" : "وضع ملء الشاشة"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
        </div>
      </header>

      {/* 2. Reader Stage */}
      <div className={styles.singlePageStage}>
        <div className={styles.pageBox}>
          {/* Mobile: Clean, branded card that opens in a new tab */}
          {isMobile ? (
            <div className={styles.androidPromptOverlay}>
              <div className={styles.androidPromptCard}>
                <BookOpen size={40} color="var(--main_color)" />
                <h3>قراءة الرواية كاملة ({totalPages} صفحة)</h3>
                <p>
                  يمكنك قراءة وتصفح صفحات الرواية كاملة مع التمرير السلس والطبيعي
                  في علامة تبويب مخصصة خالية من أشرطة التحميل.
                </p>
                <a
                  href={externalViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.androidPrimaryBtn}
                >
                  <ExternalLink size={18} />
                  <span>فتح الرواية كاملة والتمرير</span>
                </a>
              </div>
            </div>
          ) : (
            /* Desktop / Web: Full novel with normal continuous scrolling */
            <div className={styles.iframeClipWrapper}>
              <iframe
                key={page}
                src={desktopPdfUrl}
                title={`قراءة ${book.title} - صفحة ${page}`}
                className={styles.pdfIframe}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          )}

          {/* Loading Overlay on Desktop */}
          {isLoading && !isMobile && (
            <div className={styles.boxLoadingOverlay} aria-hidden="true">
              <div className={styles.loadingPill}>
                <Loader2 size={22} className={styles.spinner} />
                <span className={styles.loadingPillText}>
                  جاري تجهيز صفحة {page}...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
