import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { booksService } from "@/server/services/books.service";
import { PageHeader } from "@/components/common/PageHeader";
import { BookDetailsContainer } from "@/features/book-details";
import { GlobalCTA } from "@/components/common/GlobalCTA";

import { constructMetadata, BASE_URL } from "@/utils/seo";

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
  const { bookSlug } = await params;
  const decodedBookId = decodeURIComponent(bookSlug);
  const { book } = await booksService.getBookById(decodedBookId);

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
    path: `/categories/${encodeURIComponent(book.categorySlug)}/${encodeURIComponent(book.id)}`,
    image: book.coverImage,
    type: "article",
    keywords: [
      book.title,
      book.author,
      book.category,
      "قراءة كتاب",
      "مطالعة كتب",
      "كتب مسيحية",
      "منصة قلم",
    ],
  });
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { bookSlug } = await params;
  const decodedBookId = decodeURIComponent(bookSlug);
  const { book, relatedBooks } = await booksService.getBookById(decodedBookId);

  if (!book) {
    notFound();
  }

  const bookUrl = `${BASE_URL}/categories/${encodeURIComponent(book.categorySlug)}/${encodeURIComponent(book.id)}`;
  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    description:
      book.description ||
      `قراءة ومطالعة كتاب ${book.title} للمؤلف ${book.author} في قسم ${book.category} عبر منصة قَلَم للمكتبة المسيحية.`,
    image: book.coverImage || `${BASE_URL}/logo.jpg`,
    inLanguage: "ar",
    genre: book.category,
    ...(book.pagesCount ? { numberOfPages: book.pagesCount } : {}),
    url: bookUrl,
    publisher: {
      "@type": "Organization",
      name: "قَلَم للمكتبة المسيحية",
      url: BASE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "أقسام المكتبة",
        item: `${BASE_URL}/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: book.category,
        item: `${BASE_URL}/categories/${encodeURIComponent(book.categorySlug)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: book.title,
        item: bookUrl,
      },
    ],
  };

  return (
    <div className="page-main-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
          <BookDetailsContainer book={book} relatedBooks={relatedBooks} />
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="استمر في رحلة القراءة"
        title="هل تبحث عن مؤلفات أخرى في نفس الموضوع؟"
        description="تضم منصة قَلَم مئات المؤلفات والدراسات المسيحية الأصيلة المتاحة للمطالعة والقراءة المباشرة على الموقع."
        primaryAction={{
          label: "تصفح الأقسام",
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

