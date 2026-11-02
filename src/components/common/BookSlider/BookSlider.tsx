"use client";

import React, { useRef } from "react";
import { BookCard } from "@/components/common/BookCard";
import type { BookItem } from "@/data/books.data";
import styles from "./BookSlider.module.scss";

interface BookSliderProps {
  books: BookItem[];
  showControls?: boolean;
}

export const BookSlider: React.FC<BookSliderProps> = ({ books }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.sliderWrapper}>
      <div ref={trackRef} className={styles.scrollTrack}>
        {books.map((book) => (
          <div key={book.id} className={styles.slideItem}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};
