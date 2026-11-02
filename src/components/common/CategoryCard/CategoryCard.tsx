import React, { memo } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { CategoryItem } from "@/data/categories.data";
import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
  category: CategoryItem;
}

const CategoryCardComponent: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      href={`/categories/${encodeURIComponent(category.slug)}`}
      className={styles.cardWrapper}
    >
      <div className={styles.iconBox} aria-hidden="true">
        <BookOpen size={22} />
      </div>

      <h3 className={styles.cardTitle}>{category.title}</h3>
      <span className={styles.booksCount}>{category.booksCount} كتاب</span>
    </Link>
  );
};

export const CategoryCard = memo(CategoryCardComponent);
