import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { ContactContainer } from "@/features/contact";

export const metadata: Metadata = {
  title: "تواصل معنا | قَلَم - المكتبة المسيحية",
  description:
    "يسعدنا تواصلكم واستقبال استفساراتكم واقتراحاتكم بشأن الكتب والمؤلفات المسيحية على منصة قَلَم.",
};

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
        badge="انضم إلينا ككاتب"
        title="هل لديك مؤلفات أو دراسات روحية مسيحية؟"
        description="انضم إلى نخبة الكُتاب والمفكرين في منصة قَلَم، وشارك كتاباتك لتصل إلى آلاف الباحثين عن الكلمة الصادقة بكل يسر وهدوء."
        primaryAction={{
          label: "سجّل حسابك",
          href: "/register",
        }}
        secondaryAction={{
          label: "تصفح دليل المؤلفين",
          href: "/authors",
        }}
      />
    </div>
  );
}

