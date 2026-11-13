export interface ApiArticleAuthor {
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
}

export interface ApiArticleType {
  id: number | string;
  name: string;
  slug?: string;
}

export interface ApiArticle {
  id: number | string;
  title: string;
  slug: string;
  short_description?: string | null;
  body?: string | null;
  content?: string | null;
  excerpt?: string | null;
  cover_image_url?: string | null;
  read_time?: number | null;
  views_count?: number | null;
  is_published?: boolean;
  published_at?: string | null;
  is_archived?: boolean;
  author?: ApiArticleAuthor | string | null;
  type?: ApiArticleType | string | null;
  related_articles?: ApiArticle[];
}

export interface ArticlesApiResponse {
  success?: boolean;
  message?: string;
  data?: ApiArticle[];
}

export interface SingleArticleApiResponse {
  success?: boolean;
  message?: string;
  data?: ApiArticle;
}

export interface PaginatedArticlesResponse {
  success?: boolean;
  message?: string;
  data?:
    | ApiArticle[]
    | {
        data?: ApiArticle[];
        current_page?: number;
        last_page?: number;
        total?: number;
        per_page?: number;
      };
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
    per_page?: number;
  };
}

export interface GetArticlesParams {
  page?: number;
  perPage?: number;
  type?: string;
  search?: string;
}

export interface GetArticlesResult {
  articles: import("@/data/articles.data").ArticleItem[];
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
  total?: number;
}
