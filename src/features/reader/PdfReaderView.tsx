"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { BookItem } from "@/data/books.data";
import styles from "./PdfReaderView.module.scss";

interface PdfReaderViewProps {
  book: BookItem;
}

// Client-only dynamic import to ensure zero SSR hydration errors
const SinglePagePdfReader = dynamic(
  () =>
    import("./SinglePagePdfReader").then((mod) => mod.SinglePagePdfReader),
  {
    ssr: false,
    loading: () => (
      <div className={styles.readerWrapper}>
        <div className={styles.loadingBox}>
          <Loader2 size={36} className={styles.spinner} />
          <p className={styles.loadingText}>جاري فتح قارئ الكتاب...</p>
        </div>
      </div>
    ),
  }
);

export const PdfReaderView: React.FC<PdfReaderViewProps> = ({ book }) => {
  return <SinglePagePdfReader book={book} />;
};
