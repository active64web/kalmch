"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Maximize2,
  Minimize2,
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

  // Loading safety fallback so it never hangs
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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
  // External link with hidden toolbars for new tab
  const externalViewUrl = `${fullPdfUrl}#toolbar=0&navpanes=0`;
  // On desktop/tablets: 100% width of box with normal continuous scroll (scrollbar=1) and FitH
  const desktopPdfUrl = `${fullPdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;

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
            <span className={styles.pagesCountBadge}>{totalPages} صفحة</span>
          </div>
        </div>

        <div className={styles.toolbarActions}>
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

          {/* Direct Open in external tab - Desktop/Tablets only */}
          {!isMobile && (
            <a
              href={externalViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.toolBtn} ${styles.externalOpenBtn}`}
              title="فتح الكتاب في نافذة خارجية مع التمرير"
              aria-label="فتح الكتاب في نافذة خارجية مع التمرير"
            >
              <ExternalLink size={15} />
              <span className={styles.btnLabel}>فتح في علامة تبويب جديدة</span>
            </a>
          )}

          {/* Fullscreen Toggle - Desktop and tablets */}
          {!isMobile && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`${styles.toolBtn} ${styles.fullscreenBtn}`}
              title={isFullscreen ? "إنهاء ملء الشاشة" : "تكبير الشاشة"}
              aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "تكبير الشاشة"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className={styles.fullscreenLabel}>
                {isFullscreen ? "إنهاء ملء الشاشة" : "تكبير الشاشة"}
              </span>
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
                  في علامة تبويب مخصصة خالية من الأشرطة العلوية.
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
            /* Desktop & Tablets: 100% size in box with normal continuous scroll */
            <div className={styles.iframeClipWrapper}>
              <iframe
                src={desktopPdfUrl}
                title={`قراءة ${book.title}`}
                className={styles.pdfIframe}
                scrolling="yes"
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
                  جاري تجهيز صفحات الكتاب...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
