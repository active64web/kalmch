import React from "react";
import { Metadata } from "next";
import { categoriesService } from "@/server/services/categories.service";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryCard } from "@/components/common/CategoryCard";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { constructMetadata, BASE_URL } from "@/utils/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "أقسام المكتبة المسيحية والتصنيفات | قَلَم",
  description:
    "استعرض وتصفح كافة أقسام وتصنيفات الكتب والمؤلفات والدراسات المسيحية: كتب روحية، تفاسير كتابية، تاريخ الكنيسة، كتابات الآباء الأولين، لاهوت وعقيدة عبر منصة قَلَم.",
  path: "/categories",
  keywords: [
    "أقسام الكتب المسيحية",
    "تصنيفات المكتبة المسيحية",
    "كتب روحية مسيحية",
    "تفاسير الكتاب المقدس",
    "تاريخ الكنيسة القبطية",
    "عقيدة ولاهوت مسيحي",
    "كتابات الآباء الأوائل",
    "سير وتراجم القديسين",
    "منصة قلم",
  ],
});

export default async function CategoriesPage() {
  const categories = await categoriesService.getCategories();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": BASE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "أقسام المكتبة",
        "item": `${BASE_URL}/categories`,
      },
    ],
  };

  return (
    <div className="page-main-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* 1. Page Header */}
      <PageHeader
        badge="التصنيفات الرئيسية"
        title="أقسام المكتبة"
        subtitle="استكشف تصنيفات ومحاور الكتب والمؤلفات المسيحية لتجد ما يغذي فكرك وحياتك الروحية"
        breadcrumbs={[{ label: "الأقسام" }]}
      />

      {/* 2. Categories Grid */}
      <section aria-label="أقسام وتصنيفات الكتب">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
              width: "100%",
            }}
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="انضم إلى عائلة قَلَم"
        title="هل لديك مؤلفات أو دراسات مسيحية ترغب في نشرها؟"
        description="تسعى منصة قَلَم إلى احتضان الأقلام الواعدة وتوفير كل سبل الدعم لنشر الفكر المسيحي البنّاء ليصل إلى آلاف القراء في كل مكان."
        primaryAction={{
          label: "تواصل معنا",
          href: "/contact",
        }}
        secondaryAction={{
          label: "استكشف مكتبتي",
          href: "/my-library",
        }}
      />
    </div>
  );
}
