import type { ApiBook } from "./book.types";

export interface ApiSearchCountry {
  id: number | string;
  code?: string;
  name_en?: string;
  name_ar?: string;
  flag_emoji?: string;
  flag_url?: string;
}

export interface ApiSearchAuthor {
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
  country?: ApiSearchCountry | null;
}

export interface SearchData {
  query?: string;
  books?: ApiBook[];
  authors?: ApiSearchAuthor[];
  books_count?: number;
  authors_count?: number;
}

export interface SearchApiResponse {
  success?: boolean;
  message?: string;
  data?: SearchData;
}
