"use client";

import React, { useState } from "react";
import { RotateCcw, Loader2, BookOpen } from "lucide-react";
import type { BookItem } from "@/data/books.data";
import { BookCard } from "@/components/common/BookCard";
import { getAuthorBooksAction } from "@/server/actions/author.actions";
import styles from "./AuthorDetails.module.scss";

interface AuthorBooksListProps {
  authorId: string | number;
  authorName: string;
  initialBooks: BookItem[];
  initialHasMore: boolean;
  total?: number;
}

export const AuthorBooksList: React.FC<AuthorBooksListProps> = ({
  authorId,
  authorName,
  initialBooks,
  initialHasMore,
  total,
}) => {
  const [books, setBooks] = useState<BookItem[]>(initialBooks);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const result = await getAuthorBooksAction({
        authorId,
        page: nextPage,
        perPage: 15,
      });

      if (result.books && result.books.length > 0) {
        setBooks((prev) => {
          const existingIds = new Set(prev.map((b) => b.id));
          const newUnique = result.books.filter((b) => !existingIds.has(b.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const displayedCount = total !== undefined ? total : books.length;

  return (
    <div className={styles.booksSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>مؤلفات {authorName}</h3>
        <div className={styles.countBadge}>
          <span>{displayedCount}</span> كتاب متاح
        </div>
      </div>

      {books.length > 0 ? (
        <>
          <div className={styles.booksGrid}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className={styles.loadMoreBtn}
                title="تحميل المزيد من الكتب"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    <span>جاري تحميل الكتب...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={16} />
                    <span>تحميل المزيد من الكتب</span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyCard}>
          <div style={{ marginBottom: "12px", color: "var(--main_color)" }}>
            <BookOpen size={36} />
          </div>
          <h4 className={styles.emptyTitle}>لا توجد كتب مفهرسة حالياً</h4>
          <p className={styles.emptyDesc}>
            يعمل فريق التوثيق على رقمنة وإضافة مؤلفات {authorName} في أقرب وقت.
          </p>
        </div>
      )}
    </div>
  );
};
