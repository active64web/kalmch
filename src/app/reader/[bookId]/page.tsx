import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Bookmark } from "lucide-react";
import { booksData } from "@/data/books.data";
import styles from "./ReaderPage.module.scss";

interface ReaderPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { bookId } = await params;
  const book = booksData.find((b) => b.id === bookId);

  if (!book) {
    notFound();
  }

  return (
    <div className="page-main-wrapper">
      <div className="container">
        <div className={styles.readerPlaceholder}>
          <div className={styles.topNavigation}>
            <Link href="/my-library" className={styles.backLink}>
              <ArrowRight size={18} />
              <span>العودة إلى مكتبتي</span>
            </Link>
          </div>

          <div className={styles.readerCard}>
            <div className={styles.bookEmblem} aria-hidden="true">
              <BookOpen size={48} />
            </div>

            <span className={styles.badge}>قارئ الكتب الإلكتروني</span>
            <h1 className={styles.bookTitle}>{book.title}</h1>
            <p className={styles.authorName}>المؤلف: {book.author}</p>
            <p className={styles.categoryName}>التصنيف: {book.category}</p>

            <div className={styles.infoNotice}>
              <p>
                جاري تجهيز بيئة القراءة التفاعلية وعارض الـ PDF المتطور بنمط الصفحات
                الورقية (Sepia Mode) لهذا الكتاب.
              </p>
            </div>

            <div className={styles.actionButtons}>
              <Link href="/my-library" className={styles.returnBtn}>
                <Bookmark size={16} />
                <span>العودة لمكتبتي</span>
              </Link>
              <Link href="/" className={styles.homeBtn}>
                <span>الرئيسية</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

