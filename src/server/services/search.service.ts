import { apiClient } from "../config/api-client";
import type { BookItem } from "@/data/books.data";
import type { AuthorItem } from "@/data/authors.data";
import { mapApiBookToBookItem } from "./books.service";
import type {
  SearchApiResponse,
  ApiSearchAuthor,
} from "../types/search.types";

export function mapApiSearchAuthorToAuthorItem(
  author: ApiSearchAuthor
): AuthorItem {
  let ageOrStatus = author.life_status;
  if (!ageOrStatus) {
    if (author.is_contemporary) {
      ageOrStatus = "معاصر";
    } else if (author.death_year) {
      ageOrStatus = `توفي عام ${author.death_year}`;
    } else {
      ageOrStatus = "متوفي";
    }
  }

  const countryName =
    author.country?.name_ar ||
    author.country?.name_en ||
    "غير محدد";

  return {
    id: String(author.id),
    slug: author.slug || String(author.id),
    name: author.name,
    country: countryName,
    ageOrStatus,
    avatar: author.image_url || undefined,
    bio: author.bio || undefined,
  };
}

export interface SearchResult {
  query: string;
  books: BookItem[];
  authors: AuthorItem[];
  booksCount: number;
  authorsCount: number;
  totalCount: number;
}

export const searchService = {
  /**
   * Search for books and authors via GET /api/search?search=...
   */
  async search(query: string): Promise<SearchResult> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return {
        query: "",
        books: [],
        authors: [],
        booksCount: 0,
        authorsCount: 0,
        totalCount: 0,
      };
    }

    try {
      const response = await apiClient<SearchApiResponse>(
        `/api/search?search=${encodeURIComponent(trimmedQuery)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = response?.data;
      const apiBooks = data?.books || [];
      const apiAuthors = data?.authors || [];

      const books = apiBooks.map(mapApiBookToBookItem);
      const authors = apiAuthors.map(mapApiSearchAuthorToAuthorItem);

      const booksCount = data?.books_count ?? books.length;
      const authorsCount = data?.authors_count ?? authors.length;

      return {
        query: data?.query || trimmedQuery,
        books,
        authors,
        booksCount,
        authorsCount,
        totalCount: booksCount + authorsCount,
      };
    } catch (error) {
      console.error("[searchService] Error fetching search results:", error);
      return {
        query: trimmedQuery,
        books: [],
        authors: [],
        booksCount: 0,
        authorsCount: 0,
        totalCount: 0,
      };
    }
  },
};
