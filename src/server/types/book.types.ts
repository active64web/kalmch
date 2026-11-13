export interface ApiAuthor {
  id: number | string;
  name: string;
  slug?: string;
  bio?: string | null;
  country_id?: number | null;
  is_contemporary?: boolean;
  death_year?: number | null;
  birth_year?: number | null;
  life_status?: string | null;
  image_url?: string | null;
}

export interface ApiCategoryRef {
  id?: number | string;
  name?: string;
  slug?: string;
}

export interface ApiBook {
  id: number | string;
  title: string;
  slug: string;
  description?: string | null;
  views_count?: number;
  is_book_of_the_day?: boolean;
  is_suggested?: boolean;
  is_archived?: boolean;
  cover_image_url?: string | null;
  file_url?: string | null;
  author?: ApiAuthor | string | null;
  category?: ApiCategoryRef | string | null;
  related_books?: ApiBook[];
}

export interface BooksApiResponse {
  success?: boolean;
  message?: string;
  data?: ApiBook[];
}

export interface SingleBookApiResponse {
  success?: boolean;
  message?: string;
  data?: ApiBook;
}

export interface PaginatedBooksResponse {
  success?: boolean;
  message?: string;
  data?:
    | ApiBook[]
    | {
        data?: ApiBook[];
        current_page?: number;
        last_page?: number;
        total?: number;
        per_page?: number;
        next_page_url?: string | null;
      };
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
  next_page_url?: string | null;
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
    per_page?: number;
  };
}

export interface GetCategoryBooksParams {
  categoryId?: string | number;
  categorySlug?: string;
  authorId?: string | number;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface GetCategoryBooksResult {
  books: import("@/data/books.data").BookItem[];
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
  total?: number;
}

