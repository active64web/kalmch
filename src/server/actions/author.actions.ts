"use server";

import { authorsService } from "../services/authors.service";
import type { GetAuthorBooksParams } from "../types/author.types";

/**
 * Server action to fetch paginated books for an author (for load more)
 */
export async function getAuthorBooksAction(params: GetAuthorBooksParams) {
  return authorsService.getAuthorBooks(params);
}
