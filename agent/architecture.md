# المخطط المعماري للمشروع (Architecture & Conventions)

## نظرة عامة
تم تصميم معمارية المشروع لتكون معيارية ونظيفة (Feature-Driven Architecture) تضمن سهولة الصيانة وقابلية التوسع مع الحفاظ على بساطة الكود وسرعته.

---

## تدفق البيانات (Data Flow)

### المرحلة الحالية (Mock Phase):
```
[src/data/ (Fake Data)] ──> [src/features/ or src/components/] ──> [src/app/ (Pages)]
```

### مرحلة الربط مع الـ API (Integration Phase):
```
[External API / Backend]
        │
        ▼
[src/server/ (Central API Services & Controllers)]
        │
        ▼
[src/features/ / Server Actions / Data Fetchers]
        │
        ▼
[src/app/ (Rendered Pages)]
```

---

## تفاصيل مجلدات المشروع (Directory Breakdown)

### 1. `src/app/`
- يتبع نظام **Next.js App Router**.
- كل مجلد يمثل مساراً (Route).
- يحتوي على ملفات `page.tsx` و `layout.tsx`.
- دور `page.tsx` مقتصر على جلب البيانات وتجميع الـ components الخاصة بالصفحة من `src/features/`.

### 2. `src/features/`
- مجلد خاص بكل صفحة أو ميزة مستقلة (مثال: `home`, `books`, `book-details`, `categories`, `authors`...).
- داخل كل مجلد في `features` توضع المكونات الفرعية التي تنتمي لهذه الصفحة حصراً.
- مثال:
  ```
  src/features/
  ├── home/
  │   ├── HeroBanner/
  │   ├── FeaturedBooks/
  │   └── LatestReleases/
  └── book-details/
      ├── BookInfo/
      └── RelatedBooks/
  ```

### 3. `src/components/`
- المكونات العامة التي يمكن إعادة استخدامها عبر أكثر من صفحة:
  - `components/layout/`: الهيدر (Header), الفوتر (Footer), القوائم الجانبية (Drawers / Menus).
  - `components/common/`: الأزرار (Button), حقول الإدخال (Input / Select), البطاقات العامة (BookCard), النوافذ المنبثقة (Modals).

### 4. `src/data/`
- تخزين البيانات الوهمية (Mock / Seed Data).
- تحتوي على ملفات TypeScript بصيغة كائنات ومصفوفات جاهزة لتمثيل الكتب، الأقسام، المؤلفين، والبيانات التعريفية.

### 5. `src/server/`
- مركز التحكم ونقطة الاتصال الوحيدة مع الـ API والخدمات الخارجية.
- تنظيم استدعاءات الشبكة (API clients, fetch wrappers, error handling, caching).
- عند التحول من البيانات الوهمية للربط الحي، يتم التبديل هنا دون الحاجة لإعادة كتابة مكونات الواجهة.

### 6. `src/styles/`
- ملف `global.scss` يحوي القواعد والتنسيقات الشاملة.
- الالتزام التام بالمتغيرات الثلاثة:
  - `--main_color`: `#C59B4E`
  - `--secondary_color`: `#3D250C`
  - `--therd_color`: `#543314`

