import { MetadataRoute } from "next";
import { BASE_URL } from "@/utils/seo";
import { categoriesService } from "@/server/services/categories.service";
import { booksService } from "@/server/services/books.service";
import { authorsService } from "@/server/services/authors.service";
import { articlesService } from "@/server/services/articles.service";

import type { CategoryItem } from "@/data/categories.data";
import type { BookItem } from "@/data/books.data";
import type { AuthorItem } from "@/data/authors.data";
import type { ArticleItem } from "@/data/articles.data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/authors`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const [categories, recentBooks, authors, articlesResult] =
      await Promise.all([
        categoriesService.getCategories().catch((): CategoryItem[] => []),
        booksService.getLatestBooks().catch((): BookItem[] => []),
        authorsService.getAllAuthors().catch((): AuthorItem[] => []),
        articlesService.getArticles({ perPage: 150 }).catch(() => ({
          articles: [] as ArticleItem[],
          hasMore: false,
          total: 0,
        })),
      ]);

    // 2. Categories Pages
    const categoryRoutes: MetadataRoute.Sitemap = categories.map(
      (category: CategoryItem) => ({
        url: `${BASE_URL}/categories/${category.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.85,
      })
    );

    // 3. Books Detail Pages
    const bookRoutes: MetadataRoute.Sitemap = recentBooks.map(
      (book: BookItem) => ({
        url: `${BASE_URL}/categories/${book.categorySlug}/${book.id}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      })
    );

    // 4. Authors Pages
    const authorRoutes: MetadataRoute.Sitemap = authors.map(
      (author: AuthorItem) => ({
        url: `${BASE_URL}/authors/${author.slug || author.id}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      })
    );

    // 5. Articles Detail Pages
    const articleRoutes: MetadataRoute.Sitemap = articlesResult.articles.map(
      (article: ArticleItem) => ({
        url: `${BASE_URL}/articles/${article.slug || article.id}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      })
    );

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...bookRoutes,
      ...authorRoutes,
      ...articleRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
