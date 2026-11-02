"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  Heart,
  Download,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
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

interface PdfViewport {
  width: number;
  height: number;
}

interface PdfPage {
  getViewport: (options: { scale: number }) => PdfViewport;
  render: (params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
  }) => { promise: Promise<void>; cancel: () => void };
}

interface PdfDoc {
  numPages: number;
  getPage: (num: number) => Promise<PdfPage>;
}

interface PdfRenderTask {
  cancel: () => void;
  promise: Promise<void>;
}

interface PdfJsLib {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument: (params: {
    url: string;
    cMapUrl?: string;
    cMapPacked?: boolean;
  }) => { promise: Promise<PdfDoc> };
}

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib;
  }
}

export const PdfReaderView: React.FC<PdfReaderViewProps> = ({ book }) => {
  const { isBookSaved, toggleSaveBook } = useLibrary();
  const isFavorite = isBookSaved(book.id);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<PdfDoc | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<PdfRenderTask | null>(null);

  // Local sample PDF by default to ensure 100% same-origin success
  const pdfSource = book.pdfUrl || "/sample-book.pdf";

  // Initialize PDF.js worker once script is ready
  const handleScriptLoad = () => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfJsLoaded(true);
    }
  };

  // Load PDF Document
  useEffect(() => {
    if (!pdfJsLoaded || !window.pdfjsLib) return;

    let isCancelled = false;

    const loadDocument = async () => {
      try {
        const loadingTask = window.pdfjsLib!.getDocument({
          url: pdfSource,
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setPageNum(1);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load PDF via PDF.js:", err);
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      isCancelled = true;
    };
  }, [pdfJsLoaded, pdfSource]);

  // Render Current Page onto HTML5 Canvas
  const renderPage = useCallback(
    async (num: number, currentDoc: PdfDoc, currentScale: number) => {
      if (!currentDoc || !canvasRef.current) return;

      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await currentDoc.getPage(num);
        const viewport = page.getViewport({ scale: currentScale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.name !== "RenderingCancelledException"
        ) {
          console.error("Page render error:", err);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum, pdfDoc, scale);
    }
  }, [pageNum, pdfDoc, scale, renderPage]);

  // Page Controls
  const prevPage = () => {
    if (pageNum > 1) {
      setPageNum((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (pageNum < numPages) {
      setPageNum((prev) => prev + 1);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.7));
  };

  const resetZoom = () => {
    setScale(1.2);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* 1. PDF.js CDN Script - In-browser canvas rendering */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />

      <div
        ref={containerRef}
        className={`${styles.readerWrapper} ${
          isFullscreen ? styles.fullscreenMode : ""
        }`}
      >
        {/* 2. Top Header Toolbar */}
        <div className={styles.readerToolbar}>
          <div className={styles.toolbarStart}>
            <Link
              href={`/categories/${encodeURIComponent(
                book.categorySlug
              )}/${encodeURIComponent(book.slug)}`}
              className={styles.backLink}
              title="العودة لصفحة تفاصيل الكتاب"
            >
              <ArrowRight size={17} />
              <span>تفاصيل الكتاب</span>
            </Link>

            <div className={styles.bookMetaHeader}>
              <h1 className={styles.headerTitle}>{book.title}</h1>
              <span className={styles.headerAuthor}>— {book.author}</span>
            </div>
          </div>

          <div className={styles.toolbarActions}>
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

            {/* Optional Download (Only when user explicitly clicks it) */}
            <a
              href={pdfSource}
              download={`${book.title}.pdf`}
              className={styles.toolBtn}
              title="تحميل نسخة PDF للجهاز"
            >
              <Download size={15} />
              <span className={styles.btnLabel}>تحميل</span>
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
        </div>

        {/* 3. Sub-Toolbar: Page Navigation & Zoom Controls */}
        <div className={styles.subToolbar}>
          {/* Page Flipping */}
          <div className={styles.pageNavGroup}>
            <button
              type="button"
              onClick={prevPage}
              disabled={pageNum <= 1}
              className={styles.navBtn}
              title="الصفحة السابقة"
            >
              <ChevronRight size={18} />
              <span>السابقة</span>
            </button>

            <span className={styles.pageIndicator}>
              صفحة <strong>{pageNum}</strong> من <strong>{numPages}</strong>
            </span>

            <button
              type="button"
              onClick={nextPage}
              disabled={pageNum >= numPages}
              className={styles.navBtn}
              title="الصفحة التالية"
            >
              <span>التالية</span>
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className={styles.zoomGroup}>
            <button
              type="button"
              onClick={zoomOut}
              className={styles.zoomBtn}
              title="تصغير"
            >
              <ZoomOut size={16} />
            </button>

            <span className={styles.zoomLabel}>{Math.round(scale * 100)}%</span>

            <button
              type="button"
              onClick={zoomIn}
              className={styles.zoomBtn}
              title="تكبير"
            >
              <ZoomIn size={16} />
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className={styles.zoomBtn}
              title="إعادة ضبط الحجم"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* 4. Canvas PDF Display Area (Renders directly in browser) */}
        <div className={styles.canvasContainer}>
          {isLoading && (
            <div className={styles.canvasLoader}>
              <div className={styles.spinner} />
              <p>جاري عرض صفحات الكتاب في المتصفح...</p>
            </div>
          )}

          <div
            className={styles.canvasSheetWrapper}
            style={{ display: isLoading ? "none" : "block" }}
          >
            <canvas ref={canvasRef} className={styles.pdfCanvas} />
          </div>
        </div>
      </div>
    </>
  );
};
