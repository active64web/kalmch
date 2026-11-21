import { apiClient } from "../config/api-client";
import type { CategoryItem } from "@/data/categories.data";
import type {
  ApiCategory,
  CategoriesApiResponse,
} from "../types/category.types";

function mapApiCategoryToItem(category: ApiCategory): CategoryItem {
  return {
    id: String(category.id),
    slug: category.slug || String(category.id),
    title: category.name,
    booksCount: Number(category.books_count ?? 0),
  };
}

export const categoriesService = {
  /**
   * Fetch all categories from GET /api/categories
   * Maps only Arabic name, slug, id, and books_count while keeping fixed UI icons.
   */
  async getCategories(): Promise<CategoryItem[]> {
    try {
      const response = await apiClient<CategoriesApiResponse | ApiCategory[]>(
        "/api/categories",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const rawCategories = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
        ? response.data
        : null;

      if (!rawCategories) {
        return [];
      }

      return rawCategories.map(mapApiCategoryToItem);
    } catch {
      return [];
    }
  },
};

