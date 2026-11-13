import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { constructMetadata } from "@/utils/seo";
import { articlesService } from "@/server/services/articles.service";
import { ArticlesList } from "./ArticlesList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = constructMetadata({
  title: "المقالات والدراسات | قَلَم - إضاءات الفكر المسيحي",
  description:
    "استكشف باقة من المقالات الروحية والدراسات الآبائية واللاهوتية العميقة لنخبة من كبار الآباء والمؤلفين عبر منصة قَلَم.",
  path: "/articles",
  keywords: [
    "مقالات مسيحية",
    "دراسات آبائية",
    "فكر كنسي",
    "دراسات لاهوتية",
    "مقالات البابا شنوده",
    "مقالات متى المسكين",
    "منصة قلم",
  ],
});

export default async function ArticlesPage() {
  const result = await articlesService.getArticles({
    page: 1,
    perPage: 15,
  });

  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header */}
      <PageHeader
        badge="أقلام وفكر"
        title="المقالات والدراسات"
        subtitle="تصفح إضاءات روحية وبحوثاً آبائية ولاهوتية تثري الفكر وتعمق المعرفة عبر منصة قَلَم"
        breadcrumbs={[{ label: "المقالات" }]}
      />

      {/* 2. Articles Grid with Load More */}
      <section aria-label="قائمة المقالات والدراسات">
        <div className="container">
          <ArticlesList
            initialArticles={result.articles}
            initialHasMore={result.hasMore}
          />
        </div>
      </section>

      {/* 3. Global CTA */}
      <GlobalCTA
        badge="أقلام مسيحية رائدة"
        title="هل لديك أبحاث أو دراسات مسيحية ترغب في نشرها؟"
        description="تسعى منصة قَلَم إلى احتضان الأقلام الواعدة ونشر الفكر المسيحي البنّاء ليصل إلى آلاف الباحثين والقرّاء في كل مكان."
        primaryAction={{
          label: "تواصل معنا للنشر",
          href: "/contact",
        }}
        secondaryAction={{
          label: "تصفح أحدث الكتب",
          href: "/categories",
        }}
      />
    </div>
  );
}
