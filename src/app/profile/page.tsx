import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { ProfileContainer } from "@/features/profile";
import { constructMetadata } from "@/utils/seo";

export const metadata: Metadata = constructMetadata({
  title: "حسابي الشخصي | قَلَم",
  description:
    "إدارة بيانات حسابك الشخصي وتحديث كلمة المرور وإعدادات الأمان على منصة قَلَم.",
  path: "/profile",
  noIndex: true,
});

export default function ProfilePage() {
  return (
    <div className="page-main-wrapper">
      <PageHeader
        badge="إدارة الحساب"
        title="حسابي الشخصي"
        subtitle="إدارة معلوماتك الشخصية وتحديث بيانات الدخول والأمان لحسابك على منصة قَلَم"
        breadcrumbs={[{ label: "حسابي" }]}
      />

      <section aria-label="إعدادات الحساب الشخصي">
        <div className="container">
          <ProfileContainer />
        </div>
      </section>

      <GlobalCTA
        badge="استكشف مكتبتك"
        title="تابع قراءة كتبك المفضلة من مكتبتك الخاصة"
        description="تستطيع في أي وقت استعراض الكتب التي قمت بحفظها أو تصفح أقسام المكتبة المسيحية."
        primaryAction={{
          label: "مكتبتي الخاصة",
          href: "/my-library",
        }}
        secondaryAction={{
          label: "تصفح الأقسام",
          href: "/categories",
        }}
      />
    </div>
  );
}

