"use server";

import { articlesService } from "../services/articles.service";
import type { GetArticlesParams } from "../types/article.types";

/**
 * Server action to record article read (POST /api/articles/:id/read)
 */
export async function recordArticleReadAction(articleId: string | number) {
  try {
    await articlesService.recordArticleRead(articleId);
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Server action to fetch paginated articles (for load more)
 */
export async function getArticlesAction(params: GetArticlesParams) {
  return articlesService.getArticles(params);
}

