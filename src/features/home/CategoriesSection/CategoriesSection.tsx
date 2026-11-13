import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CategoryCard } from "@/components/common/CategoryCard";
import { categoriesService } from "@/server/services/categories.service";
import styles from "./CategoriesSection.module.scss";

export async function CategoriesSection() {
  // Fetch categories from API and display only the first 6 on the home page
  const categories = await categoriesService.getCategories();
  const displayCategories = categories.slice(0, 6);

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
