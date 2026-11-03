import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCard } from "@/components/common/BookCard";
import { booksData } from "@/data/books.data";
import styles from "./BooksSection.module.scss";

export const BooksSection: React.FC = () => {
  // Take 10 latest books (5 per row x 2 rows)
  const latest10Books = booksData.slice(0, 10);

  return (
    <section className={styles.sectionWrapper} aria-label="أحدث الكتب">
      <div className="container">
        <SectionHeader
          title="أحدث الكتب"
          subtitle="أحدث الإصدارات والمؤلفات المسيحية المضافة حديثاً للمكتبة"
          action={{
            label: "عرض كل الكتب",
            href: "/categories",
          }}
        />

        <div className={styles.booksGrid}>
          {latest10Books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};
