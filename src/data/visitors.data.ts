export interface CountryVisitorItem {
  id: string;
  code: string; // ISO 2-letter code for flag CDN
  name: string; // اسم الدولة بالعربية
  flagEmoji: string; // علم الدولة كـ Emoji
  visitorsCount: number; // عدد الزوار الرقمي
  displayCount: string; // العرض النصي المنسق
  sharePercent: number; // النسبة التقريبية
  flagUrl?: string; // رابط العلم من الـ API
}

// Cleaned up static data: all visitor statistics are dynamically loaded from the API
export const visitorsData: CountryVisitorItem[] = [];

