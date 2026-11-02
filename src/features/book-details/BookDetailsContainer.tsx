import React from "react";
import type { BookItem } from "@/data/books.data";
import { BookInfo } from "./BookInfo/BookInfo";

interface BookDetailsContainerProps {
  book: BookItem;
}

export const BookDetailsContainer: React.FC<BookDetailsContainerProps> = ({
  book,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <BookInfo book={book} />
    </div>
  );
};
