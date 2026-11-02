import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { AuthContainer } from "@/features/auth";
import { constructMetadata } from "@/utils/seo";

export const metadata: Metadata = constructMetadata({
  title: "إنشاء حساب جديد | قَلَم - المكتبة المسيحية",
  description:
    "أنشئ حسابك المجاني في منصة قَلَم وانضم إلى مجتمع القراء والمفكرين في التراث الفكري والروحي المسيحي.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="page-main-wrapper">
      <PageHeader
        badge="بوابة الحساب"
        title="إنشاء حساب جديد"
        subtitle="أنشئ حسابك المجاني وانضم إلى عائلة قَلَم للاستفادة الكاملة من مميزات المكتبة وتنظيم قراءاتك"
      />

      <section aria-label="نموذج إنشاء الحساب">
        <div className="container">
          <AuthContainer initialTab="register" />
        </div>
      </section>
    </div>
  );
}
