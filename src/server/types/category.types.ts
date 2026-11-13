export interface ApiCategory {
  id: number | string;
  name: string;
  slug: string;
  books_count: number;
  icon_url?: string | null;
}

export interface CategoriesApiResponse {
  success?: boolean;
  message?: string;
  data?: ApiCategory[];
}

