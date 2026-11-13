"use server";

import { booksService } from "../services/books.service";
import type { GetCategoryBooksParams } from "../types/book.types";

/**
 * Server action to record book read (POST /api/books/:id/read)
 */
export async function recordBookReadAction(bookId: string | number) {
  try {
    await booksService.recordBookRead(bookId);
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Server action to fetch paginated category books (for load more)
 */
export async function getCategoryBooksAction(params: GetCategoryBooksParams) {
  return booksService.getCategoryBooks(params);
}


