import React from "react";
import { Metadata } from "next";
import { authorsService } from "@/server/services/authors.service";
import { PageHeader } from "@/components/common/PageHeader";
import { AuthorsList } from "./AuthorsList";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { constructMetadata, BASE_URL } from "@/utils/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = constructMetadata({
  title: "المؤلفون وأعلام الفكر المسيحي والكنسي | قَلَم",
  description:
    "دليل شامل لآباء الكنيسة، اللاهوتيين، والمفكرين المسيحيين المعاصرين والأوائل: تصفح سيرهم الذاتية، مؤلفاتهم، وكتبهم المتاحة للقراءة المباشرة عبر منصة قَلَم.",
  path: "/authors",
  keywords: [
    "مؤلفين مسيحيين",
    "آباء الكنيسة الأوائل",
    "البابا شنوده الثالث",
    "الأب متى المسكين",
    "القمص تادرس يعقوب ملطي",
    "نيافة الأنبا رافائيل",
    "القديس أثناسيوس الرسولي",
    "القديس كيرلس الكبير",
    "يوحنا ذهبي الفم",
    "مكتبة مسيحية",
    "منصة قلم",
  ],
});

export default async function AuthorsPage() {
  const allAuthors = await authorsService.getAllAuthors();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "المؤلفون",
        item: `${BASE_URL}/authors`,
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
        badge="أعلام الفكر الكنسي"
        title="المؤلفون"
        subtitle="تعرف على سير وأعلام الفكر واللاهوت المسيحي وتصفح كافة مؤلفاتهم وأعمالهم عبر منصة قَلَم"
        breadcrumbs={[{ label: "المؤلفون" }]}
      />

      {/* 2. Authors List with client-side pagination */}
      <section aria-label="قائمة المؤلفين">
        <div className="container">
          <AuthorsList authors={allAuthors} perPage={15} />
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="أقلام مسيحية رائدة"
        title="هل أنت كاتب أو باحث في العلوم الكنسية؟"
        description="انضم إلى نخبة الكتّاب والمؤلفين على منصة قَلَم وانشر أبحاثك ودراساتك لتصل إلى آلاف القرّاء والباحثين حول العالم."
        primaryAction={{
          label: "تواصل معنا",
          href: "/contact",
        }}
        secondaryAction={{
          label: "تصفح الأقسام",
          href: "/categories",
        }}
      />
    </div>
  );
}
