import { apiClient } from "../config/api-client";
import type { BookItem } from "@/data/books.data";
import type {
  ApiBook,
  BooksApiResponse,
  SingleBookApiResponse,
  PaginatedBooksResponse,
  GetCategoryBooksParams,
  GetCategoryBooksResult,
} from "../types/book.types";

export function mapApiBookToBookItem(apiBook: ApiBook): BookItem {
  const authorName =
    typeof apiBook.author === "string"
      ? apiBook.author
      : apiBook.author?.name || "غير محدد";

  const authorSlug =
    typeof apiBook.author === "object" && apiBook.author?.slug
      ? apiBook.author.slug
      : undefined;

  const categoryName =
    typeof apiBook.category === "string"
      ? apiBook.category
      : apiBook.category?.name || "كتب عامة";

  const categorySlug =
    typeof apiBook.category === "object" && apiBook.category?.slug
      ? apiBook.category.slug
      : "general";

  return {
    id: String(apiBook.id),
    slug: apiBook.slug || String(apiBook.id),
    title: apiBook.title,
    author: authorName,
    authorId: authorSlug,
    category: categoryName,
    categorySlug,
    coverImage: apiBook.cover_image_url || undefined,
    readsCount: Number(apiBook.views_count ?? 0),
    description: apiBook.description || undefined,
    pdfUrl: apiBook.file_url || undefined,
    badge: apiBook.is_book_of_the_day ? "مميز" : undefined,
    section: "latest",
  };
}

export const booksService = {
  /**
   * Fetch latest books from GET /api/books/latest (capped at max 10 books)
   */
  async getLatestBooks(): Promise<BookItem[]> {
    try {
      const response = await apiClient<BooksApiResponse | ApiBook[]>(
        "/api/books/latest",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const rawBooks = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
        ? response.data
        : null;

      if (!rawBooks || rawBooks.length === 0) {
        return [];
      }

      return rawBooks.slice(0, 10).map(mapApiBookToBookItem);
    } catch {
      return [];
    }
  },

  /**
   * Fetch books for category with pagination (GET /api/books?category_id=...&page=...&per_page=15)
   */
  async getCategoryBooks(
    params: GetCategoryBooksParams
  ): Promise<GetCategoryBooksResult> {
    const page = params.page || 1;
    const perPage = params.perPage || 15;

    const query = new URLSearchParams();
    if (params.categoryId) {
      query.set("category_id", String(params.categoryId));
    }
    if (params.categorySlug) {
      query.set("category", params.categorySlug);
    }
    if (params.search) {
      query.set("search", params.search);
    }
    query.set("page", String(page));
    query.set("per_page", String(perPage));

    try {
      const response = await apiClient<PaginatedBooksResponse | ApiBook[]>(
        `/api/books?${query.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      let rawBooks: ApiBook[] = [];
      let currentPage = page;
      let lastPage = 1;
      let total: number | undefined;

      if (Array.isArray(response)) {
        rawBooks = response;
        lastPage = rawBooks.length >= perPage ? page + 1 : page;
      } else if (response && typeof response === "object") {
        if (Array.isArray(response.data)) {
          rawBooks = response.data;
          currentPage =
            response.current_page || response.meta?.current_page || page;
          lastPage =
            response.last_page ||
            response.meta?.last_page ||
            (rawBooks.length >= perPage ? currentPage + 1 : currentPage);
          total = response.total || response.meta?.total;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          Array.isArray(response.data.data)
        ) {
          rawBooks = response.data.data;
          currentPage = response.data.current_page || page;
          lastPage =
            response.data.last_page ||
            (rawBooks.length >= perPage ? currentPage + 1 : currentPage);
          total = response.data.total;
        }
      }

      const books = rawBooks.map(mapApiBookToBookItem);
      const hasMore = currentPage < lastPage && rawBooks.length > 0;

      return {
        books,
        currentPage,
        lastPage,
        hasMore,
        total,
      };
    } catch {
      return {
        books: [],
        currentPage: page,
        lastPage: 1,
        hasMore: false,
        total: 0,
      };
    }
  },

  /**
   * Fetch single book details from GET /api/books/:id
   */
  async getBookById(id: string | number): Promise<{
    book: BookItem | null;
    relatedBooks: BookItem[];
  }> {
    const bookId = String(id).trim();

    try {
      const response = await apiClient<SingleBookApiResponse | ApiBook>(
        `/api/books/${encodeURIComponent(bookId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const rawBook: ApiBook | null =
        (response as SingleBookApiResponse)?.data ||
        ((response as ApiBook)?.id ? (response as ApiBook) : null);

      if (rawBook) {
        const book = mapApiBookToBookItem(rawBook);
        const relatedBooks = Array.isArray(rawBook.related_books)
          ? rawBook.related_books.map(mapApiBookToBookItem)
          : [];

        return { book, relatedBooks };
      }
    } catch {
      // Fallback below
    }

    return {
      book: null,
      relatedBooks: [],
    };
  },

  /**
   * Alias for getBookById
   */
  async getBookByIdOrSlug(id: string | number) {
    return this.getBookById(id);
  },

  /**
   * Record book read / increment view count
   * Endpoint: POST /api/books/:id/read
   */
  async recordBookRead(bookId: string | number): Promise<void> {
    try {
      await apiClient(`/api/books/${encodeURIComponent(bookId)}/read`, {
        method: "POST",
      });
    } catch {
      // Silent catch
    }
  },
};

