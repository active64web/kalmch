"use server";

import { libraryService } from "../services/library.service";
import { getAuthTokenServer } from "../config/cookies";

/**
 * Server action to get user's favorite library books: GET /api/library
 */
export async function getUserLibraryAction(clientToken?: string) {
  const token = clientToken || (await getAuthTokenServer());
  if (!token) {
    return { success: false, books: [], error: "UNAUTHORIZED" };
  }

  const books = await libraryService.getUserLibrary(token);
  return { success: true, books };
}

/**
 * Server action to toggle book in/out of favorites: POST /api/library/favorites
 */
export async function toggleFavoriteAction(
  bookId: number | string,
  clientToken?: string
) {
  const token = clientToken || (await getAuthTokenServer());
  if (!token) {
    return {
      success: false,
      error: "UNAUTHORIZED",
      message: "يرجى تسجيل الدخول أولاً لإضافة الكتاب إلى مكتبتك المفضلة",
    };
  }

  try {
    const result = await libraryService.toggleFavorite(bookId, token);
    return {
      success: true,
      message: result?.message || "تم تحديث المفضلة بنجاح",
      data: result,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      message: error.message || "حدث خطأ أثناء تحديث المفضلة",
    };
  }
}
