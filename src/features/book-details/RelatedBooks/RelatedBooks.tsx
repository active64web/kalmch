import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCard } from "@/components/common/BookCard";
import { booksData, BookItem } from "@/data/books.data";
import styles from "./RelatedBooks.module.scss";

interface RelatedBooksProps {
  currentBook: BookItem;
}

export const RelatedBooks: React.FC<RelatedBooksProps> = ({ currentBook }) => {
  // Find related books in the same category
  let related = booksData.filter(
    (b) => b.categorySlug === currentBook.categorySlug && b.id !== currentBook.id
  );

  // If not enough in category, pick other popular/latest books
  if (related.length < 5) {
    const others = booksData.filter(
      (b) => b.id !== currentBook.id && !related.some((r) => r.id === b.id)
    );
    related = [...related, ...others].slice(0, 5);
  } else {
    related = related.slice(0, 5);
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

