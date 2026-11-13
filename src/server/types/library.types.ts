import type { ApiBook } from "./book.types";

export interface LibraryApiResponse {
  success?: boolean;
  message?: string;
  data?:
    | ApiBook[]
    | {
        books?: ApiBook[];
        favorites?: ApiBook[];
        data?: ApiBook[];
      };
}

export interface ToggleFavoritePayload {
  book_id: number | string;
}

export interface ToggleFavoriteResponse {
  success?: boolean;
  message?: string;
  is_favorite?: boolean;
  data?: unknown;
}

