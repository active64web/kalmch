export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  quote?: {
    text: string;
    source: string;
  };
  author: string;
  authorId?: string;
  category: string;
  categorySlug: string;
  type?: string;
  publishedAt: string;
  readingTime: string;
  readTime?: number;
  readsCount: number;
  viewsCount?: number;
  shortDescription?: string;
  coverImage?: string;
}

// Cleaned up static data: all articles are now dynamically loaded from the API
export const articlesData: ArticleItem[] = [];
