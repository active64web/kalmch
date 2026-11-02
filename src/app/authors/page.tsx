import React from "react";
import { Metadata } from "next";
import { authorsData } from "@/data/authors.data";
import { PageHeader } from "@/components/common/PageHeader";
import { AuthorCard } from "@/components/common/AuthorCard";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { constructMetadata } from "@/utils/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = constructMetadata({
  title: "المؤلفون | قَلَم - أعلام الفكر الكنسي",
  description:
    "تعرف على آباء الكنيسة، اللاهوتيين، والمؤلفين المسيحيين وتصفح كافة مؤلفاتهم وأعمالهم الخالدة عبر منصة قَلَم.",
  path: "/authors",
  keywords: [
    "مؤلفين مسيحيين",
    "آباء الكنيسة",
    "البابا شنوده الثالث",
    "الأب متى المسكين",
    "القمص تادرس يعقوب",
    "نيافة الأنبا رافائيل",
    "كتب مسيحية",
    "منصة قلم",
  ],
});

export default function AuthorsPage() {
  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header */}
      <PageHeader
        badge="أعلام الفكر الكنسي"
        title="المؤلفون"
        subtitle="تعرف على سير وأعلام الفكر واللاهوت المسيحي وتصفح كافة مؤلفاتهم وأعمالهم عبر منصة قَلَم"
        breadcrumbs={[{ label: "المؤلفون" }]}
      />

      {/* 2. Authors Grid */}
      <section aria-label="قائمة المؤلفين">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
              width: "100%",
            }}
          >
            {authorsData.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="أقلام مسيحية رائدة"
        title="هل أنت كاتب أو باحث في العلوم الكنسية؟"
        description="انضم إلى نخبة الكتّاب والمؤلفين على منصة قَلَم وانشر أبحاثك ودراساتك لتصل إلى آلاف القرّاء والباحثين حول العالم."
        primaryAction={{
          label: "تواصل معنا للنشر",
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
