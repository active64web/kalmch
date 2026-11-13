import React from "react";
import type { BookItem } from "@/data/books.data";
import { BookInfo } from "./BookInfo/BookInfo";
import { RelatedBooks } from "./RelatedBooks/RelatedBooks";

interface BookDetailsContainerProps {
  book: BookItem;
  relatedBooks?: BookItem[];
}

export const BookDetailsContainer: React.FC<BookDetailsContainerProps> = ({
  book,
  relatedBooks,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "40px" }}>
      <BookInfo book={book} />
      <RelatedBooks currentBook={book} relatedBooks={relatedBooks} />
    </div>
  );
};
