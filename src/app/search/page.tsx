import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { SearchX, ArrowLeft, BookOpen, Users } from "lucide-react";
import { searchService } from "@/server/services/search.service";
import { PageHeader } from "@/components/common/PageHeader";
import { BookCard } from "@/components/common/BookCard";
import { AuthorCard } from "@/components/common/AuthorCard";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import styles from "./SearchPage.module.scss";
import { constructMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    search?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const rawQuery = (params.q || params.search || "").trim();

  return constructMetadata({
    title: rawQuery
      ? `نتائج البحث عن "${rawQuery}" | قَلَم`
      : "البحث في المكتبة | قَلَم",
    description: rawQuery
      ? `نتائج البحث عن "${rawQuery}" في كتب ومؤلفي منصة قَلَم المسيحية.`
      : "ابحث في آلاف الكتب والمؤلفات والدراسات المسيحية عبر منصة قَلَم.",
    path: rawQuery ? `/search?q=${encodeURIComponent(rawQuery)}` : "/search",
    keywords: [
      rawQuery,
      "بحث في الكتب",
      "مؤلفين مسيحيين",
      "كتب مسيحية",
      "منصة قلم",
      "المكتبة المسيحية",
    ].filter(Boolean),
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = (params.q || params.search || "").trim();

  const searchResult = await searchService.search(rawQuery);
  const { books, authors, totalCount } = searchResult;

  const hasQuery = rawQuery.length > 0;
  const hasResults = totalCount > 0;
  const hasBooks = books.length > 0;
  const hasAuthors = authors.length > 0;

  // Subtitle generation based on findings
  let subtitleText =
    "اكتب كلمة البحث في شريط البحث بالأعلى لاستكشاف عناوين الكتب والمؤلفين";

  if (hasQuery) {
    if (hasBooks && hasAuthors) {
      subtitleText = `تم العثور على ${books.length} كتاب و ${authors.length} مؤلف`;
    } else if (hasBooks) {
      subtitleText = `تم العثور على ${books.length} كتاب يطابق بحثك`;
    } else if (hasAuthors) {
      subtitleText = `تم العثور على ${authors.length} مؤلف يطابق بحثك`;
    } else {
      subtitleText = "لم نتمكن من العثور على كتب أو مؤلفين يطابقون كلمة البحث";
    }
  }

  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header */}
      <PageHeader
        badge="نتائج البحث"
        title={hasQuery ? `نتائج البحث عن: "${rawQuery}"` : "البحث في المكتبة"}
        subtitle={subtitleText}
        breadcrumbs={[{ label: "نتائج البحث" }]}
      />

      {/* 2. Results Content */}
      <section className={styles.searchContent} aria-label="قائمة نتائج البحث">
        <div className="container">
          {hasResults ? (
            <>
              <div className={styles.resultsMeta}>
                <div className={styles.countBadge}>
                  إجمالي النتائج: <span>{totalCount}</span> نتيجة
                </div>
              </div>

              {/* Authors Section (if returned) */}
              {hasAuthors && (
                <section
                  className={styles.resultSection}
                  aria-label="نتائج المؤلفين"
                >
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      <Users size={22} />
                      <span>المؤلفون</span>
                    </h3>
                    <span className={styles.sectionBadge}>
                      {authors.length} مؤلف
                    </span>
                  </div>

                  <div className={styles.authorsGrid}>
                    {authors.map((author) => (
                      <AuthorCard key={author.id} author={author} />
                    ))}
                  </div>
                </section>
              )}

              {/* Books Section (if returned) */}
              {hasBooks && (
                <section
                  className={styles.resultSection}
                  aria-label="نتائج الكتب"
                >
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      <BookOpen size={22} />
                      <span>الكتب</span>
                    </h3>
                    <span className={styles.sectionBadge}>
                      {books.length} كتاب
                    </span>
                  </div>

                  <div className={styles.booksGrid}>
                    {books.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </section>
              )}
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
        title="هل تبحث عن كتاب أو مؤلف غير متوفر؟"
        description="فريق قَلَم يعمل باستمرار على فهرسة ورقمنة التراث والمؤلفات المسيحية. تواصل معنا واقترح ما ترغب في توفيره في أقرب وقت."
        primaryAction={{
          label: "تواصل معنا واقترح",
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
