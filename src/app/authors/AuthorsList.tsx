"use client";

import React, { useState, useMemo, useRef } from "react";
import { ChevronRight, ChevronLeft, UserX } from "lucide-react";
import type { AuthorItem } from "@/data/authors.data";
import { AuthorCard } from "@/components/common/AuthorCard";
import styles from "./AuthorsPage.module.scss";

interface AuthorsListProps {
  authors: AuthorItem[];
  perPage?: number;
}

export const AuthorsList: React.FC<AuthorsListProps> = ({
  authors,
  perPage = 15,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(authors.length / perPage));

  // Current page authors
  const currentAuthors = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return authors.slice(start, start + perPage);
  }, [authors, currentPage, perPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);

    if (containerRef.current) {
      const topOffset = containerRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  if (authors.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconBox} aria-hidden="true">
          <UserX size={36} />
        </div>
        <h3 className={styles.emptyTitle}>لا يوجد مؤلفون حالياً</h3>
        <p className={styles.emptySubtitle}>
          يتم العمل حالياً على أرشفة وإضافة سير ومؤلفات الكتّاب المسيحيين.
        </p>
      </div>
    );
  }

  // Generate pagination items
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const startCount = (currentPage - 1) * perPage + 1;
  const endCount = Math.min(currentPage * perPage, authors.length);

  return (
    <div ref={containerRef} className={styles.authorsWrapper}>
      {/* Top Meta */}
      <div className={styles.resultsMeta}>
        <div className={styles.countBadge}>
          إجمالي المؤلفين: <span>{authors.length}</span> مؤلف
        </div>
        {totalPages > 1 && (
          <div className={styles.rangeInfo}>
            عرض {startCount} - {endCount} من أصل {authors.length}
          </div>
        )}
      </div>

      {/* Authors Grid */}
      <div className={styles.authorsGrid}>
        {currentAuthors.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className={styles.paginationContainer}
          aria-label="تنقل صفحات المؤلفين"
        >
          {/* Previous (RTL: right arrow means back) */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationBtn}
            aria-label="الصفحة السابقة"
          >
            <ChevronRight size={18} />
            <span>السابق</span>
          </button>

          {/* Page Numbers */}
          <div className={styles.pagesList}>
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className={styles.dots}>
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => handlePageChange(Number(p))}
                  className={`${styles.pageNumber} ${
                    currentPage === p ? styles.active : ""
                  }`}
                  aria-current={currentPage === p ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Next (RTL: left arrow means next) */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationBtn}
            aria-label="الصفحة التالية"
          >
            <span>التالي</span>
            <ChevronLeft size={18} />
          </button>
        </nav>
      )}
    </div>
  );
};
