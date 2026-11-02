"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  X,
  SlidersHorizontal,
  Trash2,
  BookOpen,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { BookCard } from "@/components/common/BookCard";
import styles from "./LibraryContainer.module.scss";

export const LibraryContainer: React.FC = () => {
  const { savedBooks, totalSavedCount, clearLibrary, isLoaded } = useLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "rating">("recent");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Extract unique categories present in saved books
  const availableCategories = useMemo(() => {
    const map = new Map<string, string>();
    savedBooks.forEach((b) => {
      if (b.category && b.categorySlug) {
        map.set(b.categorySlug, b.category);
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [savedBooks]);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    let result = [...savedBooks];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((b) => b.categorySlug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title, "ar"));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }
    // "recent" preserves saved order

    return result;
  }, [savedBooks, selectedCategory, searchQuery, sortBy]);

  // Loading skeleton state
  if (!isLoaded) {
    return (
      <div className={styles.loadingWrapper} aria-label="جاري تحميل مكتبتك">
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>جاري تجهيز مكتبتك الشخصية...</p>
      </div>
    );
  }

  // 1. Overall Empty Library (No books saved at all)
  if (totalSavedCount === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconCircle} aria-hidden="true">
          <Bookmark size={42} className={styles.emptyIcon} />
        </div>
        <h2 className={styles.emptyTitle}>مكتبتك فارغة حالياً</h2>
        <p className={styles.emptyDescription}>
          لم تقم بحفظ أي كتب في مكتبتك الخاصة بعد. أثناء تصفحك للكتب والمؤلفات،
          اضغط على علامة القلب لحفظ كتابك المفضل والرجوع إليه لمطالعته وقراءته هنا في أي وقت.
        </p>

        <div className={styles.emptyActions}>
          <Link href="/" className={styles.primaryActionBtn}>
            <BookOpen size={17} />
            <span>تصفح أحدث الكتب</span>
          </Link>
          <Link href="/categories" className={styles.secondaryActionBtn}>
            <span>استكشف كافة الأقسام</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // 2. Populated Library with Toolbar & Books Grid
  return (
    <div className={styles.libraryWrapper}>
      {/* Top Controls Toolbar */}
      <div className={styles.toolbarCard}>
        {/* Row 1: Search & Stats & Clear */}
        <div className={styles.toolbarTopRow}>
          {/* Stats Pill */}
          <div className={styles.statsPill}>
            <Bookmark size={15} className={styles.statsIcon} />
            <span>
              الكتب المحفوظة: <strong>{totalSavedCount}</strong>
            </span>
          </div>

          {/* Search Field */}
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في كتبك المحفوظة أو المؤلفين..."
              className={styles.searchInput}
              aria-label="بحث في الكتب المحفوظة"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={styles.clearSearchBtn}
                title="مسح البحث"
                aria-label="مسح البحث"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Selector & Clear All */}
          <div className={styles.topActionsGroup}>
            <div className={styles.sortSelector}>
              <SlidersHorizontal size={14} className={styles.sortIcon} />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "recent" | "title" | "rating")
                }
                className={styles.sortSelect}
                aria-label="ترتيب الكتب"
              >
                <option value="recent">الأحدث حفظاً</option>
                <option value="title">الاسم (أبجدياً)</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>

            {/* Clear All Button */}
            {!showClearConfirm ? (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className={styles.clearAllBtn}
                title="تفريغ كل الكتب من المكتبة"
              >
                <Trash2 size={14} />
                <span>تفريغ المكتبة</span>
              </button>
            ) : (
              <div className={styles.confirmBox}>
                <span className={styles.confirmText}>تأكيد الحذف؟</span>
                <button
                  type="button"
                  onClick={() => {
                    clearLibrary();
                    setShowClearConfirm(false);
                  }}
                  className={styles.confirmYesBtn}
                >
                  نعم
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className={styles.confirmNoBtn}
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Category Filter Chips */}
        {availableCategories.length > 0 && (
          <div className={styles.categoriesRow} role="tablist" aria-label="تصفية حسب القسم">
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
              className={`${styles.categoryChip} ${
                selectedCategory === "all" ? styles.activeChip : ""
              }`}
            >
              الكل ({savedBooks.length})
            </button>
            {availableCategories.map((cat) => {
              const count = savedBooks.filter(
                (b) => b.categorySlug === cat.slug
              ).length;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`${styles.categoryChip} ${
                    selectedCategory === cat.slug ? styles.activeChip : ""
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Books Display Grid or Filter Empty State */}
      {filteredBooks.length > 0 ? (
        <div className={styles.booksGrid}>
          {filteredBooks.map((book) => (
            <div key={book.id} className={styles.bookCardWrapper}>
              <BookCard
                book={book}
                variant="library"
                showReadAction
                showRemoveButton
              />
            </div>
          ))}
        </div>
      ) : (
        /* Filter has 0 results */
        <div className={styles.noFilterResults}>
          <Search size={32} className={styles.noResultsIcon} />
          <h3 className={styles.noResultsTitle}>لا توجد نتائج مطابقة</h3>
          <p className={styles.noResultsDesc}>
            لم نجد أي كتاب يطابق معايير البحث أو القسم المحدد داخل مكتبتك.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className={styles.resetFilterBtn}
          >
            <RotateCcw size={14} />
            <span>إعادة ضبط البحث والتصنيف</span>
          </button>
        </div>
      )}
    </div>
  );
};

