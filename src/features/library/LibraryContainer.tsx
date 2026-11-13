"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, BookOpen, ArrowLeft, LogIn } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { useAuth } from "@/context/AuthContext";
import { BookCard } from "@/components/common/BookCard";
import styles from "./LibraryContainer.module.scss";

export const LibraryContainer: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { savedBooks, totalSavedCount, isLoaded } = useLibrary();

  // Loading state
  if (isAuthLoading || !isLoaded) {
    return (
      <div className={styles.loadingWrapper} aria-label="جاري تحميل مكتبتك">
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>جاري تجهيز مكتبتك الشخصية...</p>
      </div>
    );
  }

  // Unauthenticated State (Not logged in)
  if (!isAuthenticated) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconCircle} aria-hidden="true">
          <Bookmark size={42} className={styles.emptyIcon} />
        </div>
        <h2 className={styles.emptyTitle}>يرجى تسجيل الدخول لعرض مكتبتك</h2>
        <p className={styles.emptyDescription}>
          للوصول إلى مكتبتك الخاصة ومتابعة كتبك ومؤلفاتك المفضلة المحفوظة، يرجى تسجيل الدخول إلى حسابك في منصة قَلَم.
        </p>

        <div className={styles.emptyActions}>
          <Link href="/login" className={styles.primaryActionBtn}>
            <LogIn size={17} />
            <span>تسجيل الدخول الآن</span>
          </Link>
          <Link href="/register" className={styles.secondaryActionBtn}>
            <span>إنشاء حساب جديد</span>
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Empty State (Logged in, but no books saved)
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

  // Direct Books Grid (without any filters)
  return (
    <div className={styles.libraryWrapper}>
      <div className={styles.booksGrid}>
        {savedBooks.map((book) => (
          <div key={book.id} className={styles.bookCardWrapper}>
            <BookCard
              book={book}
              variant="library"
              showRemoveButton
            />
          </div>
        ))}
      </div>
    </div>
  );
};
