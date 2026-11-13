import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCard } from "@/components/common/BookCard";
import { booksData, BookItem } from "@/data/books.data";
import styles from "./RelatedBooks.module.scss";

interface RelatedBooksProps {
  currentBook: BookItem;
  relatedBooks?: BookItem[];
}

export const RelatedBooks: React.FC<RelatedBooksProps> = ({
  currentBook,
  relatedBooks,
}) => {
  // Use API relatedBooks if available, otherwise fallback to local books
  let related: BookItem[] = [];

  if (relatedBooks && relatedBooks.length > 0) {
    related = relatedBooks.filter((b) => b.id !== currentBook.id).slice(0, 5);
  }

  if (related.length === 0) {
    related = booksData.filter(
      (b) =>
        b.categorySlug === currentBook.categorySlug && b.id !== currentBook.id
    );

    if (related.length < 5) {
      const others = booksData.filter(
        (b) => b.id !== currentBook.id && !related.some((r) => r.id === b.id)
      );
      related = [...related, ...others].slice(0, 5);
    } else {
      related = related.slice(0, 5);
    }
  }

  if (related.length === 0) return null;

  return (
    <section className={styles.relatedSection} aria-label="كتب ذات صلة">
      <SectionHeader
        title="كتب أخرى ذات صلة"
        subtitle={`مؤلفات ودراسات روحية مختارة من قسم ${currentBook.category}`}
        action={{
          label: "عرض كل كتب القسم",
          href: `/categories?category=${encodeURIComponent(currentBook.categorySlug)}`,
        }}
      />

      <div className={styles.booksGrid}>
        {related.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};

