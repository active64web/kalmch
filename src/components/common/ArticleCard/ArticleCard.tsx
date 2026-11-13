"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { Eye, Feather, ScrollText } from "lucide-react";
import type { ArticleItem } from "@/data/articles.data";
import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
  article: ArticleItem;
}

const ArticleCardComponent: React.FC<ArticleCardProps> = ({ article }) => {
  const [failedCover, setFailedCover] = useState<string | null>(null);
  const articleHref = `/articles/${encodeURIComponent(article.id || article.slug)}`;
  const reads = Number(article.readsCount ?? article.viewsCount ?? 0);
  const typeName = article.type || "مقال";
  const hasCover =
    Boolean(article.coverImage) && failedCover !== article.coverImage;

  return (
    <Link
      href={articleHref}
      className={styles.cardContainer}
      aria-label={`مقال: ${article.title}`}
    >
      <article className={styles.cardArticle}>
        {/* 1. Article Cover Box (with poster and placeholder fallback) */}
        <div
          className={`${styles.coverBox} ${
            hasCover ? styles.hasPoster : ""
          }`}
        >
          {hasCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.coverImage}
              alt={article.title}
              className={styles.coverPoster}
              loading="lazy"
              onError={() => setFailedCover(article.coverImage || "")}
            />
          ) : (
            <div className={styles.placeholderIconBox} aria-hidden="true">
              <ScrollText size={24} className={styles.coverIcon} />
            </div>
          )}
        </div>

        {/* 2. Meta Row: Dynamic Article Type Badge */}
        <div className={styles.cardMeta}>
          <div
            className={styles.articleTypeBadge}
            title={`تصنيف المحتوى: ${typeName}`}
          >
            <ScrollText size={13} className={styles.badgeIcon} />
            <span>{typeName}</span>
          </div>
        </div>

        {/* 3. Title & Excerpt */}
        <div className={styles.contentBox}>
          <h3 className={styles.title} title={article.title}>
            {article.title}
          </h3>
          <p className={styles.excerpt}>
            {article.shortDescription || article.excerpt}
          </p>
        </div>

        {/* 4. Footer: Author Info & Reads Count */}
        <div className={styles.cardFooter}>
          <div className={styles.authorAndStats}>
            <div
              className={styles.authorRow}
              title={`الكاتب: ${article.author}`}
            >
              <Feather size={13} className={styles.authorIcon} />
              <span className={styles.authorName}>{article.author}</span>
            </div>

            <div
              className={styles.readsCount}
              title={`${reads.toLocaleString("en-US")} قراءة`}
            >
              <Eye size={12} className={styles.readsIcon} />
              <span>{reads.toLocaleString("en-US")} قراءة</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export const ArticleCard = memo(ArticleCardComponent);
export default ArticleCard;
