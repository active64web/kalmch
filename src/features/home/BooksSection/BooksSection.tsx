import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCard } from "@/components/common/BookCard";
import { booksService } from "@/server/services/books.service";
import styles from "./BooksSection.module.scss";

export async function BooksSection() {
  const allLatest = await booksService.getLatestBooks();
  // Ensure maximum 10 books appear in the section
  const latestBooks = allLatest.slice(0, 10);

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
          {latestBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
