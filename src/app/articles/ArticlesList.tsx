"use client";

import React, { useState } from "react";
import { RotateCcw, Loader2, ScrollText } from "lucide-react";
import type { ArticleItem } from "@/data/articles.data";
import { ArticleCard } from "@/components/common/ArticleCard";
import { getArticlesAction } from "@/server/actions/article.actions";
import styles from "./ArticlesPage.module.scss";

interface ArticlesListProps {
  initialArticles: ArticleItem[];
  initialHasMore: boolean;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  initialArticles,
  initialHasMore,
}) => {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const result = await getArticlesAction({
        page: nextPage,
        perPage: 15,
      });

      if (result.articles && result.articles.length > 0) {
        setArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newUnique = result.articles.filter((a) => !existingIds.has(a.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (articles.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconBox} aria-hidden="true">
          <ScrollText size={36} />
        </div>
        <h3 className={styles.emptyTitle}>لا توجد مقالات حالياً</h3>
        <p className={styles.emptySubtitle}>
          يتم حالياً تجهيز وإضافة مقالات ودراسات جديدة ومثرية إلى المنصة.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.articlesWrapper}>
      {/* Articles Grid */}
      <div className={styles.articlesGrid}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className={styles.loadMoreBtn}
            title="تحميل المزيد من المقالات"
          >
            {isLoadingMore ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                <span>جاري تحميل المقالات...</span>
              </>
            ) : (
              <>
                <RotateCcw size={16} />
                <span>تحميل المزيد من المقالات</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

