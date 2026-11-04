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

  // Exact page count (129 for hatshepsut)
  const totalPages = book.pagesCount || 129;
  const [page, setPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>("1");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Keyboard navigation: Left Arrow = Next page, Right Arrow = Previous page
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

  // Resolves the exact single-page PDF to guarantee page jumping on iPhone and all devices
  const getPageUrl = (pageNum: number) => {
    if (
      book.id === "b-hatshepsut" ||
      book.slug === "ahebat-rajolan-hatshepsut"
    ) {
      return `/books/hatshepsut-pages/page-${pageNum}.pdf#view=Fit&toolbar=0&navpanes=0&scrollbar=0`;
    }
    const basePdf = book.pdfUrl || "/hatshepsut-novel.pdf";
    return `${basePdf}#page=${pageNum}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`;
  };

  const fullPdfUrl = book.pdfUrl || "/hatshepsut-novel.pdf";

  return (
    <div
      ref={containerRef}
      className={`${styles.readerWrapper} ${
        isFullscreen ? styles.fullscreenMode : ""
      }`}
    >
      {/* 1. Header Toolbar (Clean and spacious) */}
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
          {/* Page Navigation Controls */}
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
            href={fullPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.toolBtn}
            title="فتح الكتاب كاملاً في نافذة خارجية"
            aria-label="فتح الكتاب كاملاً في نافذة خارجية"
          >
            <ExternalLink size={15} />
            <span className={styles.btnLabel}>فتح كامل</span>
          </a>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`${styles.toolBtn} ${styles.fullscreenBtn}`}
            title={isFullscreen ? "إنهاء وضع ملء الشاشة" : "وضع ملء الشاشة"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* 2. Single Page Stage: Strictly 1 page fitted with exact aspect ratio and zero internal scroll */}
      <div className={styles.singlePageStage}>
        <div className={styles.pageBox}>
          <div className={styles.iframeClipWrapper}>
            <iframe
              key={page}
              src={getPageUrl(page)}
              title={`قراءة ${book.title} - صفحة ${page}`}
              className={styles.pdfIframe}
              scrolling="no"
              onLoad={() => setIsLoading(false)}
            />
          </div>

          {/* Stable Loading Overlay: Matches exact box size, page never jumps */}
          {isLoading && (
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
