import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoriesService } from "@/server/services/categories.service";
import { booksService } from "@/server/services/books.service";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryBooksList } from "@/features/categories/CategoryBooksList";
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
  const categories = await categoriesService.getCategories();
  const category = categories.find((c) => c.slug === decodedSlug);

  if (!category) {
    return constructMetadata({
      title: "القسم غير موجود",
      description: "عذراً، لم نتمكن من العثور على هذا القسم في مكتبة قَلَم.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `كتب ${category.title} | قَلَم - المكتبة المسيحية`,
    description:
      category.description ||
      `استعرض واقرأ كتب قسم ${category.title} في المكتبة المسيحية على منصة قَلَم.`,
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
  const categories = await categoriesService.getCategories();
  const category = categories.find((c) => c.slug === decodedSlug);

  if (!category) {
    notFound();
  }

  // Fetch initial books for this category from API (page 1, per_page 15)
  const { books, hasMore } = await booksService.getCategoryBooks({
    categoryId: category.id,
    categorySlug: category.slug,
    page: 1,
    perPage: 15,
  });

  const categorySubtitle =
    category.description ||
    `تصفح كافة الكتب والمؤلفات المصنفة ضمن قسم ${category.title}.`;

  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header */}
      <PageHeader
        badge="كتب القسم"
        title={category.title}
        subtitle={categorySubtitle}
        breadcrumbs={[
          { label: "الأقسام", href: "/categories" },
          { label: category.title },
        ]}
      />

      {/* 2. Category Books Grid with Load More */}
      <section aria-label={`كتب قسم ${category.title}`}>
        <div className="container">
          <CategoryBooksList
            initialBooks={books}
            initialHasMore={hasMore}
            categoryId={category.id}
            categorySlug={category.slug}
            categoryTitle={category.title}
          />
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

