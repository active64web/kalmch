import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ArticleCard } from "@/components/common/ArticleCard";
import { articlesService } from "@/server/services/articles.service";
import styles from "./ArticlesSection.module.scss";

export async function ArticlesSection() {
  const allLatest = await articlesService.getLatestArticles();
  // Ensure maximum 8 articles appear in the section
  const latestArticles = allLatest.slice(0, 8);

  return (
    <section className={styles.sectionWrapper} aria-label="أحدث المقالات والدراسات">
      <div className="container">
        <SectionHeader
          badge="أقلام وفكر"
          title="أحدث المقالات والدراسات"
          subtitle="إضاءات روحية ودراسات آبائية ولاهوتية تثري الفكر وتعمق الحياة الإيمانية"
          action={{
            label: "عرض كل المقالات",
            href: "/articles",
          }}
        />

        <div className={styles.articlesGrid}>
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
