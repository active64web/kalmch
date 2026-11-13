import { apiClient } from "../config/api-client";
import { mapApiBookToBookItem } from "./books.service";
import type { BookItem } from "@/data/books.data";
import type {
  LibraryApiResponse,
  ToggleFavoriteResponse,
} from "../types/library.types";
import type { ApiBook } from "../types/book.types";

export const libraryService = {
  /**
   * Fetch user's favorite library books from GET /api/library
   */
  async getUserLibrary(token: string): Promise<BookItem[]> {
    if (!token) return [];

    try {
      const response = await apiClient<LibraryApiResponse | ApiBook[]>(
        "/api/library",
        {
          method: "GET",
          token,
          cache: "no-store",
        }
      );

      let rawBooks: ApiBook[] = [];

      if (Array.isArray(response)) {
        rawBooks = response;
      } else if (response && typeof response === "object") {
        if (Array.isArray(response.data)) {
          rawBooks = response.data;
        } else if (response.data && typeof response.data === "object") {
          const inner = response.data as {
            books?: ApiBook[];
            favorites?: ApiBook[];
            data?: ApiBook[];
          };
          if (Array.isArray(inner.books)) {
            rawBooks = inner.books;
          } else if (Array.isArray(inner.favorites)) {
            rawBooks = inner.favorites;
          } else if (Array.isArray(inner.data)) {
            rawBooks = inner.data;
          }
        }
      }

      const normalizedBooks = rawBooks
        .map((item: unknown) => {
          const rec = item as Record<string, unknown>;
          if (rec?.book && typeof rec.book === "object") {
            return rec.book as ApiBook;
          }
          return item as ApiBook;
        })
        .filter((b): b is ApiBook => Boolean(b && (b.id !== undefined || b.title)));

      return normalizedBooks.map(mapApiBookToBookItem);
    } catch {
      return [];
    }
  },

  /**
   * Toggle book in/out of favorites: POST /api/library/favorites
   */
  async toggleFavorite(
    bookId: number | string,
    token: string
  ): Promise<ToggleFavoriteResponse> {
    const numericId = Number(bookId);
    const idToSend = !isNaN(numericId) && numericId > 0 ? numericId : bookId;

    return apiClient<ToggleFavoriteResponse>("/api/library/favorites", {
      method: "POST",
      token,
      body: JSON.stringify({ book_id: idToSend }),
    });
  },
};

