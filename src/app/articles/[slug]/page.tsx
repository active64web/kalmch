import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScrollText, Feather, Calendar, Clock, Eye, ArrowLeft } from "lucide-react";
import { articlesData } from "@/data/articles.data";
import { PageHeader } from "@/components/common/PageHeader";
import { ArticleCard } from "@/components/common/ArticleCard";
import { GlobalCTA } from "@/components/common/GlobalCTA";
import { constructMetadata } from "@/utils/seo";
import { ArticleShareBtn } from "./ArticleShareBtn";
import styles from "./ArticleDetails.module.scss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const article = articlesData.find(
    (a) => a.slug === decodedSlug || a.id === decodedSlug
  );

  if (!article) {
    return constructMetadata({
      title: "المقال غير موجود | قَلَم",
      description: "عذراً، لم نتمكن من العثور على هذا المقال في منصة قَلَم.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${article.title} - ${article.author} | قَلَم`,
    description: article.excerpt,
    path: `/articles/${article.slug}`,
    image: article.coverImage,
    type: "article",
    keywords: [
      article.title,
      article.author,
      article.category,
      "مقالات مسيحية",
      "دراسات كنسية",
      "منصة قلم",
    ],
  });
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const article = articlesData.find(
    (a) => a.slug === decodedSlug || a.id === decodedSlug
  );

  if (!article) {
    notFound();
  }

  const reads = article.readsCount || 1200;
  const moreArticles = articlesData
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="page-main-wrapper">
      {/* 1. Page Header */}
      <PageHeader
        badge="تفاصيل المقال"
        title={article.title}
        subtitle={`بقلم: ${article.author}`}
        breadcrumbs={[
          { label: "المقالات", href: "/articles" },
          { label: article.title },
        ]}
      />

      {/* 2. Article Details Main Section */}
      <section className={styles.articleSection} aria-label={`مقال ${article.title}`}>
        <div className="container">
          <div className={styles.articleCard}>
            {/* Cover Box (Matching the default book card / book details placeholder style) */}
            <div className={styles.coverBox}>
              <div className={styles.placeholderIconBox} aria-hidden="true">
                <ScrollText size={38} className={styles.coverIcon} />
              </div>
            </div>

            {/* Header Meta */}
            <div className={styles.articleHeader}>
              <div className={styles.categoryAndDate}>
                <div className={styles.articleTypeBadge} title="مقال فكري ودراسة كنسية">
                  <ScrollText size={13} className={styles.badgeIcon} />
                  <span>مقال</span>
                </div>
                <div className={styles.readingTime}>
                  <Clock size={14} className={styles.metaIcon} />
                  <span>{article.readingTime}</span>
                </div>
              </div>

              <h1 className={styles.articleTitle}>{article.title}</h1>

              {article.excerpt && (
                <p className={styles.articleExcerpt}>{article.excerpt}</p>
              )}

              <div className={styles.metaBar}>
                <div className={styles.authorMeta}>
                  <Feather size={15} className={styles.authorIcon} />
                  <span>بقلم: {article.author}</span>
                </div>

                <div className={styles.statsAndActions}>
                  <div
                    className={styles.readsBadge}
                    title={`${reads.toLocaleString("en-US")} قراءة`}
                  >
                    <Eye size={13} className={styles.readsIcon} />
                    <span>{reads.toLocaleString("en-US")} قراءة</span>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: "rgba(61, 37, 12, 0.6)",
                    }}
                  >
                    <Calendar size={13} color="var(--main_color)" />
                    {article.publishedAt}
                  </span>

                  <ArticleShareBtn title={article.title} author={article.author} />
                </div>
              </div>
            </div>

            {/* Article Body Content (Clean, dignified, readable) */}
            <div className={styles.articleBody}>
              {article.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              {article.quote && (
                <blockquote className={styles.quoteCard}>
                  <p className={styles.quoteText}>&ldquo;{article.quote.text}&rdquo;</p>
                  <cite className={styles.quoteSource}>— {article.quote.source}</cite>
                </blockquote>
              )}
            </div>
          </div>

          {/* 3. More Articles Suggestions */}
          {moreArticles.length > 0 && (
            <div className={styles.moreSection}>
              <div className={styles.moreHeader}>
                <h3 className={styles.moreTitle}>مقالات ذات صلة</h3>
                <Link
                  href="/articles"
                  className={styles.allArticlesLink}
                  title="عرض الكل"
                >
                  <span>عرض الكل</span>
                  <ArrowLeft size={14} className={styles.arrowIcon} />
                </Link>
              </div>

              <div className={styles.articlesGrid}>
                {moreArticles.map((item) => (
                  <ArticleCard key={item.id} article={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Global CTA */}
      <GlobalCTA
        badge="أقلام وفكر"
        title="استكشف المزيد من الكنوز والكتب الروحية"
        description="تضم منصة قَلَم مئات المؤلفات والدراسات المسيحية الأصيلة لآباء الكنيسة وكبار اللاهوتيين المتاحة للمطالعة المباشرة."
        primaryAction={{
          label: "تصفح الاقسام",
          href: "/categories",
        }}
        secondaryAction={{
          label: "العودة إلى المقالات",
          href: "/articles",
        }}
      />
    </div>
  );
}

