import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { BookCard } from "@/components/common/BookCard";
import type { BookItem } from "@/data/books.data";
import styles from "./RelatedBooks.module.scss";

interface RelatedBooksProps {
  currentBook: BookItem;
  relatedBooks?: BookItem[];
}

export const RelatedBooks: React.FC<RelatedBooksProps> = ({
  currentBook,
  relatedBooks,
}) => {
  const related = (relatedBooks || [])
    .filter((b) => b.id !== currentBook.id)
    .slice(0, 5);

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

