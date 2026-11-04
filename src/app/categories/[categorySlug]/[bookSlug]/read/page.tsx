import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { booksData } from "@/data/books.data";
import { PdfReaderView } from "@/features/reader/PdfReaderView";
import { GlobalCTA } from "@/components/common/GlobalCTA";

import { constructMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";

interface ReaderPageProps {
  params: Promise<{
    categorySlug: string;
    bookSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ReaderPageProps): Promise<Metadata> {
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
      title: "قارئ الكتب | قَلَم",
      description: "عذراً، لم نتمكن من فتح قارئ الكتاب المطلوب.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `قراءة كتاب: ${book.title} | قَلَم - قارئ الـ PDF`,
    description: `استعرض واقرأ كتاب ${book.title} للمؤلف ${book.author} مباشرة في المتصفح عبر منصة قَلَم.`,
    path: `/categories/${book.categorySlug}/${book.slug}/read`,
    image: book.coverImage,
    type: "article",
    keywords: [
      `قراءة ${book.title}`,
      book.title,
      book.author,
      "قارئ كتب مسيحية",
      "قراءة اونلاين",
      "منصة قلم",
    ],
  });
}

export default async function ReaderPage({ params }: ReaderPageProps) {
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
      <section aria-label={`قراءة كتاب ${book.title}`}>
        <div className="container">
          <PdfReaderView book={book} />
        </div>
      </section>

      <GlobalCTA
        badge="شارفْت على الانتهاء؟"
        title="احفظ الكتاب وتابع القراءة في أي وقت"
        description="تتيح لك منصة قَلَم إضافة الكتب إلى مكتبتك الشخصية للرجوع إليها ومواصلة رحلتك القرائية بكل سهولة."
        primaryAction={{
          label: "مكتبتي",
          href: "/my-library",
        }}
        secondaryAction={{
          label: "العودة للقسم",
          href: `/categories/${encodeURIComponent(book.categorySlug)}`,
        }}
      />
    </div>
  );
}

