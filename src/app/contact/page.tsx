import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { ContactContainer } from "@/features/contact";
import { constructMetadata } from "@/utils/seo";

export const metadata: Metadata = constructMetadata({
  title: "تواصل معنا واقتراح كتب ودراسات | قَلَم - المكتبة المسيحية",
  description:
    "يسعدنا تواصلكم واستقبال استفساراتكم وملاحظاتكم، واقتراح كتب أو أبحاث مسيحية جديدة، أو طلب نشر مؤلفاتكم الفكرية والروحية عبر منصة قَلَم.",
  path: "/contact",
  keywords: [
    "تواصل مع منصة قلم",
    "اقتراح كتاب مسيحي",
    "نشر مؤلفات مسيحية",
    "فريق عمل قلم",
    "المكتبة المسيحية الإلكترونية",
  ],
});

export default function ContactPage() {
  return (
    <div className="page-main-wrapper">
      {/* 1. Standard Unified Page Header */}
      <PageHeader
        badge="يسعدنا تواصلك"
        title="تواصل معنا"
        subtitle="نحن هنا للإجابة على جميع استفساراتك واستقبال مقترحاتك وملاحظاتك بكل اهتمام وسرور"
      />

      {/* 2. Contact Section (Info + Form) */}
      <section aria-label="بيانات ونموذج التواصل">
        <div className="container">
          <ContactContainer />
        </div>
      </section>

      {/* 3. Global Bottom CTA */}
      <GlobalCTA
        badge="انضم إلينا"
        title="هل ترغب في المساهمة في رقمنة ونشر التراث الكنسي؟"
        description="تفتح منصة قَلَم أبوابها لكل الخدام والباحثين للمشاركة في تدقيق وفهرسة الكتب لتصل إلى أكبر قطاع من محبي القراءة."
        primaryAction={{
          label: "استكشف الأقسام",
          href: "/categories",
        }}
        secondaryAction={{
          label: "مكتبتي",
          href: "/my-library",
        }}
      />
    </div>
  );
}
