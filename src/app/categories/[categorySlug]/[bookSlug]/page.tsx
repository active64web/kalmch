import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { booksData } from "@/data/books.data";
import { PageHeader } from "@/components/common/PageHeader";
import { BookDetailsContainer } from "@/features/book-details";
import { GlobalCTA } from "@/components/common/GlobalCTA";

import { constructMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";

interface BookPageProps {
  params: Promise<{
    categorySlug: string;
    bookSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { categorySlug, bookSlug } = await params;
  const decodedBookSlug = decodeURIComponent(bookSlug);
  const decodedCategorySlug = decodeURIComponent(categorySlug);

  const book = booksData.find(
    (b) =>
      (b.slug === decodedBookSlug || b.id === decodedBookSlug) &&
      (b.categorySlug === decodedCategorySlug || !decodedCategorySlug)
  );

  if (!book) {
    return constructMetadata({
      title: "كتاب غير موجود | قَلَم",
      description: "عذراً، لم نتمكن من العثور على هذا الكتاب في مكتبة قَلَم.",
      noIndex: true,
    });
  }

  const desc =
    book.description ||
    `اقرأ وتصفح كتاب "${book.title}" للمؤلف ${book.author} في قسم ${book.category} عبر منصة قَلَم للمكتبة المسيحية.`;

  return constructMetadata({
    title: `كتاب ${book.title} - ${book.author} | قَلَم`,
    description: desc,
    path: `/categories/${book.categorySlug}/${book.slug}`,
    image: book.coverImage,
    type: "article",
    keywords: [
      book.title,
      book.author,
      book.category,
      "قراءة كتاب",
      "تحميل كتاب",
      "كتب مسيحية",
      "منصة قلم",
    ],
  });
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { categorySlug, bookSlug } = await params;
  const decodedBookSlug = decodeURIComponent(bookSlug);
  const decodedCategorySlug = decodeURIComponent(categorySlug);

  const book = booksData.find(
    (b) =>
      (b.slug === decodedBookSlug || b.id === decodedBookSlug) &&
      (b.categorySlug === decodedCategorySlug || !decodedCategorySlug)
  );

  if (!book) {
    notFound();
  }

  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header (Badge: تفاصيل الكتاب | Title: اسم الكتاب | بدون سطر المؤلف) */}
      <PageHeader
        badge="تفاصيل الكتاب"
        title={book.title}
        breadcrumbs={[
          { label: "الأقسام", href: "/categories" },
          {
            label: book.category,
            href: `/categories/${encodeURIComponent(book.categorySlug)}`,
          },
          { label: book.title },
        ]}
      />

      {/* 2. Main Details Card */}
      <section aria-label={`تفاصيل كتاب ${book.title}`}>
        <div className="container">
          <BookDetailsContainer book={book} />
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="استمر في رحلة القراءة"
        title="هل تبحث عن مؤلفات أخرى في نفس الموضوع؟"
        description="تضم منصة قَلَم مئات المؤلفات والدراسات المسيحية الأصيلة المتاحة للمطالعة والتحميل المباشر."
        primaryAction={{
          label: "تصفح كافة الأقسام",
          href: "/categories",
        }}
        secondaryAction={{
          label: "العودة إلى مكتبتي",
          href: "/my-library",
        }}
      />
    </div>
  );
}

