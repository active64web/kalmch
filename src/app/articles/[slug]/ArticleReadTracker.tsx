"use client";

import { useEffect, useRef } from "react";
import { recordArticleReadAction } from "@/server/actions/article.actions";

interface ArticleReadTrackerProps {
  articleId: string | number;
}

const STORAGE_KEY = "kalmch_read_articles";

export function ArticleReadTracker({ articleId }: ArticleReadTrackerProps) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!articleId || hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const readList: string[] = stored ? JSON.parse(stored) : [];
      const currentIdStr = String(articleId);

      if (!readList.includes(currentIdStr)) {
        // Record read count on the server
        recordArticleReadAction(articleId).catch(() => {
          // Silent catch
        });

        // Add to local storage so future visits/refreshes don't double count
        readList.push(currentIdStr);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(readList));
      }
    } catch {
      // In case localStorage is disabled or fails
    }
  }, [articleId]);

  return null;
}

