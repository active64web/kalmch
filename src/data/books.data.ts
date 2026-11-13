export interface BookItem {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorId?: string;
  category: string;
  categorySlug: string;
  coverImage?: string;
  rating?: number;
  ratingsCount?: number;
  readsCount?: number;
  description?: string;
  pdfUrl?: string;
  badge?: "جديد" | "الأكثر قراءة" | "مميز" | "كتاب اليوم";
  section?: "featured" | "popular" | "latest";
}

// Cleaned up static data: all books are now dynamically loaded from the API
export const booksData: BookItem[] = [];
