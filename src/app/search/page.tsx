import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { SearchX, ArrowLeft, BookOpen } from "lucide-react";
import { booksData } from "@/data/books.data";
import { PageHeader } from "@/components/common/PageHeader";
import { BookCard } from "@/components/common/BookCard";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import styles from "./SearchPage.module.scss";

import { constructMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q ? q.trim() : "";

  return constructMetadata({
    title: query
      ? `نتائج البحث عن "${query}" | قَلَم`
      : "البحث في المكتبة | قَلَم",
    description: query
      ? `نتائج البحث عن "${query}" في كتب ودراسات ومؤلفات منصة قَلَم المسيحية.`
      : "ابحث في آلاف الكتب والدراسات والمؤلفات المسيحية عبر منصة قَلَم.",
    path: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    keywords: [
      query,
      "بحث في الكتب",
      "كتب مسيحية",
      "منصة قلم",
      "المكتبة المسيحية",
    ].filter(Boolean),
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const rawQuery = (q || "").trim();
  const normalizedQuery = rawQuery.toLowerCase();

  // Search in books by title, author, category, or description
  const matchingBooks = rawQuery
    ? booksData.filter((book) => {
        const titleMatch = book.title.toLowerCase().includes(normalizedQuery);
        const authorMatch = book.author.toLowerCase().includes(normalizedQuery);
        const categoryMatch = book.category.toLowerCase().includes(normalizedQuery);
        const descMatch = book.description
          ? book.description.toLowerCase().includes(normalizedQuery)
          : false;

        return titleMatch || authorMatch || categoryMatch || descMatch;
      })
    : [];

  const hasQuery = rawQuery.length > 0;
  const hasResults = matchingBooks.length > 0;

  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header */}
      <PageHeader
        badge="نتائج البحث"
        title={hasQuery ? `نتائج البحث عن: "${rawQuery}"` : "البحث في المكتبة"}
        subtitle={
          hasQuery
            ? hasResults
              ? `تم العثور على ${matchingBooks.length} كتاب يطابق بحثك`
              : "لم نتمكن من العثور على كتب تطابق كلمة البحث"
            : "اكتب كلمة البحث في شريط البحث بالأعلى لاستكشاف عناوين الكتب والمؤلفين"
        }
        breadcrumbs={[{ label: "نتائج البحث" }]}
      />

      {/* 2. Results Content */}
      <section className={styles.searchContent} aria-label="قائمة نتائج البحث">
        <div className="container">
          {hasResults ? (
            <>
              <div className={styles.resultsMeta}>
                <div className={styles.countBadge}>
                  <span>{matchingBooks.length}</span> كتاب متاح
                </div>
              </div>

              <div className={styles.booksGrid}>
                {matchingBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyCard}>
              <div className={styles.iconBox} aria-hidden="true">
                <SearchX size={32} />
              </div>
              <h3 className={styles.emptyTitle}>
                {hasQuery ? "لم نجد أية نتائج مطابقة" : "ابدأ البحث الآن"}
              </h3>
              <p className={styles.emptyDescription}>
                {hasQuery
                  ? `للأسف لم نجد أي كتاب أو مؤلف يطابق "${rawQuery}". يمكنك تجربة كلمات بحث أخرى أو تصفح أقسام المكتبة.`
                  : "استخدم شريط البحث بالأعلى للبحث عن أي كتاب، موضوع، أو مؤلف ترغب في قراءة مؤلفاته."}
              </p>
              <Link href="/categories" className={styles.actionBtn}>
                <BookOpen size={16} />
                <span>تصفح أقسام المكتبة</span>
                <ArrowLeft size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="لم تجد ما تبحث عنه؟"
        title="هل تبحث عن كتاب أو مخطوطة نادرة غير متوفرة؟"
        description="فريق قَلَم يعمل باستمرار على فهرسة ورقمنة التراث المسيحي. تواصل معنا واقترح الكتب التي ترغب في توفيرها في أقرب وقت."
        primaryAction={{
          label: "تواصل معنا واقترح كتاباً",
          href: "/contact",
        }}
        secondaryAction={{
          label: "استكشف الأقسام",
          href: "/categories",
        }}
      />
    </div>
  );
}

