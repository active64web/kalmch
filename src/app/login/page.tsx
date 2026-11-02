import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { AuthContainer } from "@/features/auth";

export const metadata: Metadata = {
  title: "تسجيل الدخول | قَلَم - المكتبة المسيحية",
  description:
    "سجل دخولك إلى حسابك في منصة قَلَم للوصول إلى كتبك المحفوظة ومتابعة قراءاتك المسيحية.",
};

export default function LoginPage() {
  return (
    <div className="page-main-wrapper">
      <PageHeader
        badge="بوابة الحساب"
        title="حسابك في قَلَم"
        subtitle="سجّل دخولك لمتابعة قراءاتك وكتبك المحفوظة، أو أنشئ حساباً جديداً للوصول إلى آلاف المؤلفات المسيحية"
      />

      <section aria-label="نموذج تسجيل الدخول وإنشاء الحساب">
        <div className="container">
          <AuthContainer initialTab="login" />
        </div>
      </section>
    </div>
  );
}

