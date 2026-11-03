"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Clock, Eye, Feather, ArrowLeft, ScrollText } from "lucide-react";
import type { ArticleItem } from "@/data/articles.data";
import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
  article: ArticleItem;
}

const ArticleCardComponent: React.FC<ArticleCardProps> = ({ article }) => {
  const articleHref = `/articles/${encodeURIComponent(article.slug)}`;
  const reads = article.readsCount || 1200;

  return (
    <article
      className={styles.cardContainer}
      aria-label={`مقال: ${article.title}`}
    >
      {/* 1. Article Cover Box (matching the default book card placeholder style) */}
      <div className={styles.coverBox}>
        <div className={styles.placeholderIconBox} aria-hidden="true">
          <ScrollText size={24} className={styles.coverIcon} />
        </div>
      </div>

      {/* 2. Meta Row: Fixed Article Icon + Reading Time */}
      <div className={styles.cardMeta}>
        <div className={styles.articleTypeBadge} title="مقال فكري ودراسة كنسية">
          <ScrollText size={13} className={styles.badgeIcon} />
          <span>مقال</span>
        </div>

        <div className={styles.readingTime} title="وقت القراءة المقدر">
          <Clock size={13} className={styles.metaIcon} />
          <span>{article.readingTime}</span>
        </div>
      </div>

      {/* 3. Title (Text only, no link) & Excerpt (Strictly 2 lines) */}
      <div className={styles.contentBox}>
        <h3 className={styles.title} title={article.title}>
          {article.title}
        </h3>
        <p className={styles.excerpt}>{article.excerpt}</p>
      </div>

      {/* 4. Footer: Author Info & Reads Count + Exclusive Read Button */}
      <div className={styles.cardFooter}>
        <div className={styles.authorAndStats}>
          <div className={styles.authorRow} title={`الكاتب: ${article.author}`}>
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

        <Link
          href={articleHref}
          className={styles.readLink}
          title="قراءة المقال كاملاً"
        >
          <span>قراءة المقال</span>
          <ArrowLeft size={14} className={styles.arrowIcon} />
        </Link>
      </div>
    </article>
  );
};

export const ArticleCard = memo(ArticleCardComponent);
