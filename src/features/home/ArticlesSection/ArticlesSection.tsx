import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ArticleCard } from "@/components/common/ArticleCard";
import { articlesData } from "@/data/articles.data";
import styles from "./ArticlesSection.module.scss";

export const ArticlesSection: React.FC = () => {
  // Take exactly 8 latest articles (4 per row x 2 rows)
  const latest8Articles = articlesData.slice(0, 8);

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
          {latest8Articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};
