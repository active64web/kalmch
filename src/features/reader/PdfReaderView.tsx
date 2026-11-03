"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import type { BookItem } from "@/data/books.data";
import { useLibrary } from "@/context/LibraryContext";
import styles from "./PdfReaderView.module.scss";

interface PdfReaderViewProps {
  book: BookItem;
}

export const PdfReaderView: React.FC<PdfReaderViewProps> = ({ book }) => {
  const { isBookSaved, toggleSaveBook } = useLibrary();
  const isFavorite = isBookSaved(book.id);

  // Default zoom set to 70% as requested by the user
  const [zoom, setZoom] = useState(70);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Source PDF with toolbar & navpanes disabled (#toolbar=0&navpanes=0) and controlled zoom
  const basePdf = book.pdfUrl || "/sample-book.pdf";
  const pdfViewerUrl = `${basePdf}#zoom=${zoom}&toolbar=0&navpanes=0&scrollbar=1`;

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 160));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 40));
  };

  const resetZoom = () => {
    setZoom(70);
  };

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

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
          {/* Zoom Controls (Zoom In / Zoom Out only, without download/print button) */}
          <div className={styles.zoomControls} title="التحكم في نسبة التكبير / التصغير">
            <button
              type="button"
              onClick={zoomOut}
              className={styles.zoomBtn}
              title="تصغير (-10%)"
              disabled={zoom <= 40}
              aria-label="تصغير الصفحة"
            >
              <ZoomOut size={15} />
            </button>

            <span className={styles.zoomValue}>{zoom}%</span>

            <button
              type="button"
              onClick={zoomIn}
              className={styles.zoomBtn}
              title="تكبير (+10%)"
              disabled={zoom >= 160}
              aria-label="تكبير الصفحة"
            >
              <ZoomIn size={15} />
            </button>

            {zoom !== 70 && (
              <button
                type="button"
                onClick={resetZoom}
                className={styles.zoomResetBtn}
                title="إعادة للوضع الافتراضي (70%)"
                aria-label="إعادة ضبط الزوم"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => toggleSaveBook(book)}
            className={`${styles.toolBtn} ${isFavorite ? styles.favorited : ""}`}
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

      {/* 2. PDF View Area */}
      <div className={styles.iframeContainer}>
        <iframe
          ref={iframeRef}
          key={zoom}
          src={pdfViewerUrl}
          title={`قراءة ${book.title}`}
          className={styles.pdfIframe}
        />
      </div>
    </div>
  );
};
