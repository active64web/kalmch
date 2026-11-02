import React from "react";
import { Metadata } from "next";
import { categoriesData } from "@/data/categories.data";
import { PageHeader } from "@/components/common/PageHeader";
import { CategoryCard } from "@/components/common/CategoryCard";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { constructMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "أقسام المكتبة | قَلَم - المكتبة المسيحية",
  description:
    "استعرض كافة أقسام وتصنيفات الكتب والمؤلفات والدراسات المسيحية: كتب روحية، تفاسير، تاريخ كنسي، ولاهوتيات عبر منصة قَلَم.",
  path: "/categories",
  keywords: [
    "أقسام الكتب المسيحية",
    "تصنيفات الكتب",
    "كتب روحية",
    "تفاسير ودراسات",
    "تاريخ الكنيسة",
    "عقيدة ولاهوت",
    "سير وتراجم",
  ],
});

export default function CategoriesPage() {
  return (
    <div className="page-main-wrapper">
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
            {categoriesData.map((category) => (
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
