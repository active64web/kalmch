"use client";

import React, { useState } from "react";
import { RotateCcw, Loader2, BookOpen } from "lucide-react";
import type { BookItem } from "@/data/books.data";
import { BookCard } from "@/components/common/BookCard";
import { getCategoryBooksAction } from "@/server/actions/book.actions";
import styles from "./CategoryBooksList.module.scss";

interface CategoryBooksListProps {
  initialBooks: BookItem[];
  initialHasMore: boolean;
  categoryId?: string | number;
  categorySlug: string;
  categoryTitle: string;
}

export const CategoryBooksList: React.FC<CategoryBooksListProps> = ({
  initialBooks,
  initialHasMore,
  categoryId,
  categorySlug,
  categoryTitle,
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
      const result = await getCategoryBooksAction({
        categoryId,
        categorySlug,
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

  if (books.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconBox} aria-hidden="true">
          <BookOpen size={36} />
        </div>
        <h3 className={styles.emptyTitle}>جاري إضافة كتب هذا القسم قريباً</h3>
        <p className={styles.emptySubtitle}>
          نعمل حالياً على أرشفة وتدقيق مؤلفات قسم {categoryTitle}.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.categoryBooksWrapper}>
      {/* Books Grid */}
      <div className={styles.booksGrid}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Load More Button */}
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
    </div>
  );
};

