import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoriesData } from "@/data/categories.data";
import { booksData } from "@/data/books.data";
import { PageHeader } from "@/components/common/PageHeader";
import { BookCard } from "@/components/common/BookCard";
import { GlobalCTA } from "@/components/common/GlobalCTA";

import { constructMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";

interface CategoryBooksPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryBooksPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const decodedSlug = decodeURIComponent(categorySlug);
  const category = categoriesData.find((c) => c.slug === decodedSlug);

  if (!category) {
    return constructMetadata({
      title: "القسم غير موجود",
      description: "عذراً، لم نتمكن من العثور على هذا القسم في مكتبة قَلَم.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `كتب ${category.title} | قَلَم - المكتبة المسيحية`,
    description: category.description,
    path: `/categories/${category.slug}`,
    keywords: [
      `كتب ${category.title}`,
      category.title,
      "كتب مسيحية",
      "قراءة اونلاين",
      "منصة قلم",
    ],
  });
}

export default async function CategoryBooksPage({
  params,
}: CategoryBooksPageProps) {
  const { categorySlug } = await params;
  const decodedSlug = decodeURIComponent(categorySlug);
  const category = categoriesData.find((c) => c.slug === decodedSlug);

  if (!category) {
    notFound();
  }

  const categoryBooks = booksData.filter(
    (b) => b.categorySlug === category.slug
  );

  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header */}
      <PageHeader
        badge="كتب القسم"
        title={category.title}
        subtitle={category.description}
        breadcrumbs={[
          { label: "الأقسام", href: "/categories" },
          { label: category.title },
        ]}
      />

      {/* 2. Category Books Grid */}
      <section aria-label={`كتب قسم ${category.title}`}>
        <div className="container">
          {categoryBooks.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
                width: "100%",
              }}
            >
              {categoryBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px dashed rgba(197, 155, 78, 0.3)",
              }}
            >
              <h3
                style={{
                  color: "var(--secondary_color)",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                جاري إضافة كتب هذا القسم قريباً
              </h3>
              <p style={{ color: "rgba(61, 37, 12, 0.7)", fontSize: "14px" }}>
                نعمل حالياً على أرشفة وتدقيق مؤلفات قسم {category.title}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="استكشف المزيد"
        title="هل ترغب في تصفح أقسام وتصنيفات أخرى؟"
        description="تضم منصة قَلَم مئات الكتب والمخطوطات والدراسات المسيحية المصنفة بعناية لتغذية فكرك وروحك."
        primaryAction={{
          label: "تصفح كافة الأقسام",
          href: "/categories",
        }}
        secondaryAction={{
          label: "استكشف مكتبتي",
          href: "/my-library",
        }}
      />
    </div>
  );
}

