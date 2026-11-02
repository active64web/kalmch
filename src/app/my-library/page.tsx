import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { LibraryContainer } from "@/features/library";

export const metadata: Metadata = {
  title: "مكتبتي | قَلَم - المكتبة المسيحية",
  description:
    "مجموعتك الخاصة والمختارة من الكتب والمؤلفات المسيحية المحفوظة للمطالعة والمتابعة في أي وقت على منصة قَلَم.",
};

export default function MyLibraryPage() {
  return (
    <div className="page-main-wrapper">
      {/* 1. Unified Page Header */}
      <PageHeader
        badge="مجموعتك المفضلة"
        title="مكتبتي الخاصة"
        subtitle="كتبك ومؤلفاتك الروحية المختارة في مكان واحد، لتتابع قراءتها ومطالعتها بكل هدوء وسلاسة"
        breadcrumbs={[{ label: "مكتبتي" }]}
      />

      {/* 2. Main Library Body */}
      <section aria-label="محتوى مكتبتي">
        <div className="container">
          <LibraryContainer />
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="استمر في القراءة والبحث"
        title="هل تبحث عن كتاب روحي معين أو موضوع دراسي محدد؟"
        description="تضم منصة قَلَم مئات الكتب والمخطوطات والدراسات المسيحية المصنفة بعناية لتغذية فكرك وروحك."
        primaryAction={{
          label: "تصفح الأقسام",
          href: "/categories",
        }}
        secondaryAction={{
          label: "دليل المؤلفين",
          href: "/authors",
        }}
      />
    </div>
  );
}

