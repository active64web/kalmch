import { apiClient } from "../config/api-client";
import type { AuthorItem } from "@/data/authors.data";
import { mapApiBookToBookItem } from "./books.service";
import type {
  ApiAuthor,
  AuthorsApiResponse,
  GetAuthorBooksParams,
  GetAuthorBooksResult,
} from "../types/author.types";
import type { ApiBook, PaginatedBooksResponse } from "../types/book.types";

export function mapApiAuthorToAuthorItem(author: ApiAuthor): AuthorItem {
  let ageOrStatus = author.life_status;
  if (!ageOrStatus) {
    if (author.is_contemporary) {
      ageOrStatus = "معاصر";
    } else if (author.birth_year && author.death_year) {
      ageOrStatus = `${author.birth_year} - ${author.death_year}`;
    } else if (author.death_year) {
      ageOrStatus = `توفي سنة ${author.death_year}`;
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
    countryFlag: author.country?.flag_emoji || undefined,
    birthYear: author.birth_year || null,
    deathYear: author.death_year || null,
  };
}

export const authorsService = {
  /**
   * Fetch all authors from GET /api/authors
   */
  async getAllAuthors(): Promise<AuthorItem[]> {
    try {
      const response = await apiClient<AuthorsApiResponse | ApiAuthor[]>(
        "/api/authors",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      let rawAuthors: ApiAuthor[] = [];

      if (Array.isArray(response)) {
        rawAuthors = response;
      } else if (response && Array.isArray(response.data)) {
        rawAuthors = response.data;
      }

      return rawAuthors.map(mapApiAuthorToAuthorItem);
    } catch (error) {
      console.error("[authorsService] Error fetching authors:", error);
      return [];
    }
  },

  /**
   * Fetch top authors (default 10) for home page section
   */
  async getTopAuthors(limit = 10): Promise<AuthorItem[]> {
    const all = await this.getAllAuthors();
    return all.slice(0, limit);
  },

  /**
   * Find author by slug or id
   */
  async getAuthorByIdOrSlug(idOrSlug: string): Promise<AuthorItem | null> {
    const authors = await this.getAllAuthors();
    const cleanId = decodeURIComponent(idOrSlug).trim().toLowerCase();

    const author = authors.find(
      (a) =>
        a.slug.toLowerCase() === cleanId ||
        a.id.toLowerCase() === cleanId ||
        decodeURIComponent(a.slug).toLowerCase() === cleanId
    );

    return author || null;
  },

  /**
   * Fetch paginated books for a specific author:
   * GET /api/authors/{id}/books?page=1&per_page=15
   */
  async getAuthorBooks(
    params: GetAuthorBooksParams
  ): Promise<GetAuthorBooksResult> {
    const page = params.page || 1;
    const perPage = params.perPage || 15;
    const authorId = params.authorId;

    try {
      const response = await apiClient<PaginatedBooksResponse | ApiBook[]>(
        `/api/authors/${authorId}/books?page=${page}&per_page=${perPage}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      let rawBooks: ApiBook[] = [];
      let currentPage = page;
      let lastPage = page;
      let total: number | undefined = undefined;

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
        total: total !== undefined ? total : books.length,
      };
    } catch (error) {
      console.error(
        `[authorsService] Error fetching books for author ${authorId}:`,
        error
      );
      return {
        books: [],
        currentPage: page,
        lastPage: 1,
        hasMore: false,
        total: 0,
      };
    }
  },
};
