import { MetadataRoute } from "next";
import { BASE_URL } from "@/utils/seo";
import { categoriesData } from "@/data/categories.data";
import { booksData } from "@/data/books.data";
import { authorsData } from "@/data/authors.data";
import { articlesData } from "@/data/articles.data";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // 1. Static Pages
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
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/authors`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 2. Categories Pages
  const categoryRoutes: MetadataRoute.Sitemap = categoriesData.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. Books Detail Pages
  const bookRoutes: MetadataRoute.Sitemap = booksData.map((book) => ({
    url: `${BASE_URL}/categories/${book.categorySlug}/${book.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 4. Authors Pages
  const authorRoutes: MetadataRoute.Sitemap = authorsData.map((author) => ({
    url: `${BASE_URL}/authors/${author.slug || author.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 5. Articles Detail Pages
  const articleRoutes: MetadataRoute.Sitemap = articlesData.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...bookRoutes,
    ...authorRoutes,
    ...articleRoutes,
  ];
}
