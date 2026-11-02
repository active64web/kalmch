export interface CategoryItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  booksCount: number;
  iconName: "Flame" | "ScrollText" | "Milestone" | "Library" | "Languages" | "FileText" | "BookOpen";
}

export const categoriesData: CategoryItem[] = [
  {
    id: "cat-1",
    slug: "spiritual",
    title: "كتب روحية وتأملات",
    description: "زاد روحي للتأمل اليومي والنمو في حياة الصلاة والنعمة والجهاد الروحي.",
    booksCount: 245,
    iconName: "Flame",
  },
  {
    id: "cat-2",
    slug: "biblical",
    title: "دراسات وتفاسير كتابية",
    description: "شروحات وتأملات معتمدة في أسفار العهدين القديم والجديد وسياقها التاريخي.",
    booksCount: 180,
    iconName: "ScrollText",
  },
  {
    id: "cat-3",
    slug: "history",
    title: "تاريخ الكنيسة وسير الآباء",
    description: "توثيق لمحطات الكنيسة عبر العصور وسير الشهداء والقديسين المعلمين.",
    booksCount: 135,
    iconName: "Milestone",
  },
  {
    id: "cat-4",
    slug: "patrology",
    title: "كتابات الآباء الأولين",
    description: "نصوص الآباء الرسوليين والمدافعين الأوائل وتعاليم المجامع المسكونية.",
    booksCount: 92,
    iconName: "Library",
  },
  {
    id: "cat-5",
    slug: "translated",
    title: "كتب ولاهوتيات مترجمة",
    description: "مختارات من روائع الفكر اللاهوتي المسيحي العالمي المنقولة بأمانة للعربية.",
    booksCount: 115,
    iconName: "Languages",
  },
  {
    id: "cat-6",
    slug: "articles",
    title: "أبحاث ومقالات فكرية",
    description: "دراسات وبحوث معاصرة تناقش قضايا الإيمان، الفلسفة، وحوارات العصر.",
    booksCount: 78,
    iconName: "FileText",
  },
];

