export interface CountryVisitorItem {
  id: string;
  code: string; // ISO 2-letter code for flag CDN
  name: string; // اسم الدولة بالعربية
  flagEmoji: string; // علم الدولة كـ Emoji
  visitorsCount: number; // عدد الزوار الرقمي
  displayCount: string; // العرض النصي المنسق
  sharePercent: number; // النسبة التقريبية
}

export const visitorsData: CountryVisitorItem[] = [
  {
    id: "v-eg",
    code: "eg",
    name: "مصر",
    flagEmoji: "🇪🇬",
    visitorsCount: 142500,
    displayCount: "+142 ألف زائر",
    sharePercent: 42,
  },
  {
    id: "v-us",
    code: "us",
    name: "الولايات المتحدة",
    flagEmoji: "🇺🇸",
    visitorsCount: 48200,
    displayCount: "+48 ألف زائر",
    sharePercent: 14,
  },
  {
    id: "v-ca",
    code: "ca",
    name: "كندا",
    flagEmoji: "🇨🇦",
    visitorsCount: 31400,
    displayCount: "+31 ألف زائر",
    sharePercent: 9,
  },
  {
    id: "v-au",
    code: "au",
    name: "أستراليا",
    flagEmoji: "🇦🇺",
    visitorsCount: 24800,
    displayCount: "+24 ألف زائر",
    sharePercent: 7,
  },
  {
    id: "v-de",
    code: "de",
    name: "ألمانيا",
    flagEmoji: "🇩🇪",
    visitorsCount: 19300,
    displayCount: "+19 ألف زائر",
    sharePercent: 6,
  },
  {
    id: "v-gb",
    code: "gb",
    name: "المملكة المتحدة",
    flagEmoji: "🇬🇧",
    visitorsCount: 16700,
    displayCount: "+16 ألف زائر",
    sharePercent: 5,
  },
  {
    id: "v-lb",
    code: "lb",
    name: "لبنان",
    flagEmoji: "🇱🇧",
    visitorsCount: 15200,
    displayCount: "+15 ألف زائر",
    sharePercent: 4.5,
  },
  {
    id: "v-fr",
    code: "fr",
    name: "فرنسا",
    flagEmoji: "🇫🇷",
    visitorsCount: 12900,
    displayCount: "+12 ألف زائر",
    sharePercent: 3.8,
  },
  {
    id: "v-jo",
    code: "jo",
    name: "الأردن",
    flagEmoji: "🇯🇴",
    visitorsCount: 11400,
    displayCount: "+11 ألف زائر",
    sharePercent: 3.4,
  },
  {
    id: "v-ae",
    code: "ae",
    name: "الإمارات",
    flagEmoji: "🇦🇪",
    visitorsCount: 9800,
    displayCount: "+9 آلاف زائر",
    sharePercent: 2.9,
  },
  {
    id: "v-se",
    code: "se",
    name: "السويد",
    flagEmoji: "🇸🇪",
    visitorsCount: 8600,
    displayCount: "+8 آلاف زائر",
    sharePercent: 2.5,
  },
  {
    id: "v-kw",
    code: "kw",
    name: "الكويت",
    flagEmoji: "🇰🇼",
    visitorsCount: 7300,
    displayCount: "+7 آلاف زائر",
    sharePercent: 2.2,
  },
];

