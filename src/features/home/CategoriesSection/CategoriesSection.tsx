import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CategoryCard } from "@/components/common/CategoryCard";
import { categoriesData } from "@/data/categories.data";
import styles from "./CategoriesSection.module.scss";

export const CategoriesSection: React.FC = () => {
  // Take 6 categories
  const displayCategories = categoriesData.slice(0, 6);

  return (
    <section className={styles.sectionWrapper} aria-label="أقسام الكتب">
      <div className="container">
        <SectionHeader
          title="أقسام الكتب"
          subtitle="تصفح أمهات الكتب والدراسات المسيحية بحسب موضوعها"
          action={{
            label: "عرض كل الأقسام",
            href: "/categories",
          }}
        />

        <div className={styles.categoriesGrid}>
          {displayCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
