import type { BookItem } from "@/data/books.data";
import type { AuthorItem } from "@/data/authors.data";

export interface AuthorItemWithImage extends AuthorItem {
  image_url?: string | null;
}

export interface ApiAuthorCountry {
  id: number | string;
  code?: string;
  name_en?: string;
  name_ar?: string;
  flag_emoji?: string;
  flag_url?: string;
}

export interface ApiAuthor {
  id: number | string;
  name: string;
  slug?: string;
  bio?: string | null;
  country_id?: number | null;
  is_contemporary?: boolean;
  death_year?: string | number | null;
  birth_year?: string | number | null;
  life_status?: string | null;
  image_url?: string | null;
  country?: ApiAuthorCountry | null;
}

export interface AuthorsApiResponse {
  success?: boolean;
  message?: string;
  data?: ApiAuthor[];
}

export interface SingleAuthorApiResponse {
  success?: boolean;
  message?: string;
  data?: ApiAuthor;
}

export interface GetAuthorBooksParams {
  authorId: string | number;
  page?: number;
  perPage?: number;
}

export interface GetAuthorBooksResult {
  books: BookItem[];
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
  total?: number;
}
