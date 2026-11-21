export interface AuthorItem {
  id: string;
  slug: string;
  name: string;
  country: string;
  ageOrStatus: string; // e.g. "توفي في سن 88" or "معاصر"
  avatar?: string;
  bio?: string;
  booksCount?: number;
  countryFlag?: string;
  birthYear?: string | number | null;
  deathYear?: string | number | null;
}

// Cleaned up static data: all authors are dynamically loaded from the API
export const authorsData: AuthorItem[] = [];
