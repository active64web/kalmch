import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCard } from "@/components/common/BookCard";
import { booksData } from "@/data/books.data";
import styles from "./BooksSection.module.scss";

export const BooksSection: React.FC = () => {
  // Take 15 latest books (5 per row x 3 rows)
  const latest15Books = booksData.slice(0, 15);

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
          {latest15Books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};
