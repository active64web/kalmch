import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AuthorCard } from "@/components/common/AuthorCard";
import { authorsData } from "@/data/authors.data";
import styles from "./AuthorsSection.module.scss";

export const AuthorsSection: React.FC = () => {
  // Take 10 authors (5 per row x 2 rows)
  const top10Authors = authorsData.slice(0, 10);

  return (
    <section className={styles.sectionWrapper} aria-label="أشهر المؤلفين">
      <div className="container">
        <SectionHeader
          title="أشهر المؤلفين"
          subtitle="نخبة من كُتّاب ومفكري الكنيسة الذين أثروا مكتبتنا عبر الأجيال"
          action={{
            label: "عرض كل المؤلفين",
            href: "/authors",
          }}
        />

        <div className={styles.authorsGrid}>
          {top10Authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </section>
  );
};

