import { apiClient } from "../config/api-client";
import { articlesData, type ArticleItem } from "@/data/articles.data";
import type {
  ApiArticle,
  ArticlesApiResponse,
  SingleArticleApiResponse,
  PaginatedArticlesResponse,
  GetArticlesParams,
  GetArticlesResult,
} from "../types/article.types";

export function mapApiArticleToArticleItem(
  apiArticle: ApiArticle
): ArticleItem {
  const authorName =
    typeof apiArticle.author === "string"
      ? apiArticle.author
      : apiArticle.author?.name || "كاتب قَلَم";

  const authorSlug =
    typeof apiArticle.author === "object" && apiArticle.author?.slug
      ? apiArticle.author.slug
      : undefined;

  const typeName =
    typeof apiArticle.type === "string"
      ? apiArticle.type
      : apiArticle.type?.name || "مقال";

  const readMinutes = apiArticle.read_time || 5;
  const readingTimeString = `${readMinutes} دقائق`;

  const shortDesc =
    apiArticle.short_description ||
    (apiArticle.body ? apiArticle.body.slice(0, 160) : "") ||
    "مقال ودراسة فكرية تثري الفكر وتعمق الحياة الإيمانية.";

  const excerptText = apiArticle.excerpt || "";

  let contentParagraphs: string[] = [];
  if (Array.isArray(apiArticle.content)) {
    contentParagraphs = apiArticle.content.filter(Boolean);
  } else if (typeof apiArticle.content === "string" && apiArticle.content.trim()) {
    contentParagraphs = apiArticle.content.split(/\r?\n+/).filter(Boolean);
  } else if (typeof apiArticle.body === "string" && apiArticle.body.trim()) {
    contentParagraphs = apiArticle.body.split(/\r?\n+/).filter(Boolean);
  }

  return {
    id: String(apiArticle.id),
    slug: apiArticle.slug || String(apiArticle.id),
    title: apiArticle.title,
    excerpt: excerptText,
    shortDescription: shortDesc,
    content: contentParagraphs,
    author: authorName,
    authorId: authorSlug,
    type: typeName,
    category: typeName,
    categorySlug: "articles",
    publishedAt: apiArticle.published_at || "مؤخراً",
    readingTime: readingTimeString,
    readTime: readMinutes,
    readsCount: Number(apiArticle.views_count ?? 0),
    viewsCount: Number(apiArticle.views_count ?? 0),
    coverImage: apiArticle.cover_image_url || undefined,
  };
}

export const articlesService = {
  /**
   * Fetch latest articles from GET /api/articles/latest (capped at max 8 items)
   */
  async getLatestArticles(): Promise<ArticleItem[]> {
    try {
      const response = await apiClient<ArticlesApiResponse | ApiArticle[]>(
        "/api/articles/latest",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const rawArticles = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
        ? response.data
        : null;

      if (!rawArticles || rawArticles.length === 0) {
        return articlesData.slice(0, 8);
      }

      return rawArticles.slice(0, 8).map(mapApiArticleToArticleItem);
    } catch {
      return articlesData.slice(0, 8);
    }
  },

  /**
   * Fetch paginated articles from GET /api/articles?page=...&per_page=15
   */
  async getArticles(params: GetArticlesParams = {}): Promise<GetArticlesResult> {
    const page = params.page || 1;
    const perPage = params.perPage || 15;

    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("per_page", String(perPage));
    if (params.type) {
      query.set("type", params.type);
    }
    if (params.search) {
      query.set("search", params.search);
    }

    try {
      const response = await apiClient<PaginatedArticlesResponse | ApiArticle[]>(
        `/api/articles?${query.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      let rawArticles: ApiArticle[] = [];
      let currentPage = page;
      let lastPage = 1;
      let total: number | undefined;

      if (Array.isArray(response)) {
        rawArticles = response;
        lastPage = rawArticles.length >= perPage ? page + 1 : page;
      } else if (response && typeof response === "object") {
        if (Array.isArray(response.data)) {
          rawArticles = response.data;
          currentPage =
            response.current_page || response.meta?.current_page || page;
          lastPage =
            response.last_page ||
            response.meta?.last_page ||
            (rawArticles.length >= perPage ? currentPage + 1 : currentPage);
          total = response.total || response.meta?.total;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          Array.isArray(response.data.data)
        ) {
          rawArticles = response.data.data;
          currentPage = response.data.current_page || page;
          lastPage =
            response.data.last_page ||
            (rawArticles.length >= perPage ? currentPage + 1 : currentPage);
          total = response.data.total;
        }
      }

      const articles = rawArticles.map(mapApiArticleToArticleItem);
      const hasMore = currentPage < lastPage && rawArticles.length > 0;

      return {
        articles,
        currentPage,
        lastPage,
        hasMore,
        total,
      };
    } catch {
      // Fallback: slice local articlesData
      const filtered = articlesData;
      const start = (page - 1) * perPage;
      const sliced = filtered.slice(start, start + perPage);

      return {
        articles: sliced,
        currentPage: page,
        lastPage: Math.ceil(filtered.length / perPage) || 1,
        hasMore: start + perPage < filtered.length,
        total: filtered.length,
      };
    }
  },

  /**
   * Fetch single article details from GET /api/articles/:id
   */
  async getArticleById(id: string | number): Promise<{
    article: ArticleItem | null;
    relatedArticles: ArticleItem[];
  }> {
    const articleId = String(id).trim();

    try {
      const response = await apiClient<SingleArticleApiResponse | ApiArticle>(
        `/api/articles/${encodeURIComponent(articleId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const rawArticle: ApiArticle | null =
        (response as SingleArticleApiResponse)?.data ||
        ((response as ApiArticle)?.id ? (response as ApiArticle) : null);

      if (rawArticle) {
        const article = mapApiArticleToArticleItem(rawArticle);
        const relatedArticles = Array.isArray(rawArticle.related_articles)
          ? rawArticle.related_articles.map(mapApiArticleToArticleItem)
          : [];

        return { article, relatedArticles };
      }
    } catch {
      // Fallback below
    }

    // Fallback to local articlesData
    const local = articlesData.find(
      (a) => String(a.id) === articleId || a.slug === articleId
    );

    return {
      article: local || null,
      relatedArticles: articlesData
        .filter((a) => a.id !== (local?.id || articleId))
        .slice(0, 3),
    };
  },

  /**
   * Record article read / increment view count
   * Endpoint: POST /api/articles/:id/read
   */
  async recordArticleRead(articleId: string | number): Promise<void> {
    try {
      await apiClient(`/api/articles/${encodeURIComponent(articleId)}/read`, {
        method: "POST",
      });
    } catch {
      // Silent catch
    }
  },
};
