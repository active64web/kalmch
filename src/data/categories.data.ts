export interface CategoryItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  booksCount: number;
  iconName?: "Flame" | "ScrollText" | "Milestone" | "Library" | "Languages" | "FileText" | "BookOpen";
}

// Cleaned up static data: all categories are dynamically loaded from the API
export const categoriesData: CategoryItem[] = [];

