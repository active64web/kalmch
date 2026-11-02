export interface AuthorItem {
  id: string;
  slug: string;
  name: string;
  country: string;
  ageOrStatus: string; // e.g. "توفي في سن 88" or "معاصر"
  avatar?: string;
  bio?: string;
  booksCount?: number;
}

export const authorsData: AuthorItem[] = [
  {
    id: "auth-1",
    slug: "pope-shenouda-iii",
    name: "قداسة البابا شنوده الثالث",
    country: "مصر",
    ageOrStatus: "توفي في سن 88",
    avatar: "",
    booksCount: 140,
  },
  {
    id: "auth-2",
    slug: "father-matta-el-meskeen",
    name: "الأب متى المسكين",
    country: "مصر",
    ageOrStatus: "توفي في سن 87",
    avatar: "",
    booksCount: 85,
  },
  {
    id: "auth-3",
    slug: "fr-tadros-yaacoub-malaty",
    name: "القمص تادرس يعقوب ملطي",
    country: "مصر",
    ageOrStatus: "معاصر",
    avatar: "",
    booksCount: 110,
  },
  {
    id: "auth-4",
    slug: "bishop-raphael",
    name: "نيافة الأنبا رافائيل",
    country: "مصر",
    ageOrStatus: "معاصر",
    avatar: "",
    booksCount: 45,
  },
  {
    id: "auth-5",
    slug: "st-athanasius-apostolic",
    name: "القديس أثناسيوس الرسولي",
    country: "مصر",
    ageOrStatus: "توفي في سن 75",
    avatar: "",
    booksCount: 30,
  },
  {
    id: "auth-6",
    slug: "st-john-chrysostom",
    name: "القديس يوحنا ذهبي الفم",
    country: "أنطاكية",
    ageOrStatus: "توفي في سن 58",
    avatar: "",
    booksCount: 50,
  },
  {
    id: "auth-7",
    slug: "bishop-gregorius",
    name: "نيافة الأنبا غريغوريوس",
    country: "مصر",
    ageOrStatus: "توفي في سن 82",
    avatar: "",
    booksCount: 65,
  },
  {
    id: "auth-8",
    slug: "st-cyril-great",
    name: "القديس كيرلس الكبير",
    country: "مصر",
    ageOrStatus: "توفي في سن 68",
    avatar: "",
    booksCount: 35,
  },
  {
    id: "auth-9",
    slug: "manassa-el-kommos",
    name: "الشماس منسى القمص",
    country: "مصر",
    ageOrStatus: "توفي في سن 31",
    avatar: "",
    booksCount: 20,
  },
  {
    id: "auth-10",
    slug: "fr-salib-sourial",
    name: "القمص صليب سوريال",
    country: "مصر",
    ageOrStatus: "توفي في سن 77",
    avatar: "",
    booksCount: 25,
  },
];

