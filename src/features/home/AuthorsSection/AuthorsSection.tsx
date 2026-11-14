import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AuthorCard } from "@/components/common/AuthorCard";
import { authorsService } from "@/server/services/authors.service";
import styles from "./AuthorsSection.module.scss";

export async function AuthorsSection() {
  const top10Authors = await authorsService.getTopAuthors(10);

  if (top10Authors.length === 0) {
    return null;
  }

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
}
