"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { BookItem } from "@/data/books.data";
import { useAuth } from "./AuthContext";
import {
  getUserLibraryAction,
  toggleFavoriteAction,
} from "@/server/actions/library.actions";
import { getClientCookie, AUTH_TOKEN_COOKIE } from "@/utils/cookies";

interface LibraryContextType {
  savedBookIds: string[];
  savedBooks: BookItem[];
  totalSavedCount: number;
  isBookSaved: (id: string | number) => boolean;
  toggleSaveBook: (book: BookItem) => Promise<{ success: boolean; error?: string }>;
  removeBook: (id: string | number) => Promise<{ success: boolean; error?: string }>;
  clearLibrary: () => void;
  isLoaded: boolean;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, token } = useAuth();
  const [savedBooks, setSavedBooks] = useState<BookItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Fetch user favorites from API
  const fetchLibrary = useCallback(async () => {
    const activeToken = token || getClientCookie(AUTH_TOKEN_COOKIE);
    if (!activeToken) {
      setSavedBooks([]);
      setIsLoaded(true);
      return;
    }

    try {
      const result = await getUserLibraryAction(activeToken);
      if (result.success && Array.isArray(result.books)) {
        setSavedBooks(result.books);
      } else {
        // Direct fallback fetch from client
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://ch-library.eladrabarakelkhyam.com";
        const res = await fetch(`${apiUrl}/api/library`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
        });
        if (res.ok) {
          const json = await res.json().catch(() => null);
          const raw = Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.data?.books)
            ? json.data.books
            : [];
          if (Array.isArray(raw)) {
            const mapped = raw
              .map((item: Record<string, unknown>) =>
                item?.book && typeof item.book === "object"
                  ? (item.book as Record<string, unknown>)
                  : item
              )
              .filter((b) => b && (b.id !== undefined || b.title))
              .map((b) => ({
                id: String(b.id),
                slug: String(b.slug || b.id),
                title: String(b.title || ""),
                author:
                  typeof b.author === "string"
                    ? b.author
                    : (b.author as Record<string, unknown>)?.name
                    ? String((b.author as Record<string, unknown>).name)
                    : "غير محدد",
                category:
                  typeof b.category === "string"
                    ? b.category
                    : (b.category as Record<string, unknown>)?.name
                    ? String((b.category as Record<string, unknown>).name)
                    : "كتب عامة",
                categorySlug:
                  typeof b.category === "object" &&
                  (b.category as Record<string, unknown>)?.slug
                    ? String((b.category as Record<string, unknown>).slug)
                    : "general",
                coverImage: b.cover_image_url
                  ? String(b.cover_image_url)
                  : undefined,
                readsCount: Number(b.views_count ?? 0),
                description: b.description ? String(b.description) : undefined,
                pdfUrl: b.file_url ? String(b.file_url) : undefined,
              }));
            setSavedBooks(mapped);
          }
        }
      }
    } catch {
      setSavedBooks([]);
    } finally {
      setIsLoaded(true);
    }
  }, [token]);

  useEffect(() => {
    let isCancelled = false;
    const activeToken = token || getClientCookie(AUTH_TOKEN_COOKIE);

    if (activeToken) {
      getUserLibraryAction(activeToken)
        .then((result) => {
          if (!isCancelled) {
            if (result.success && Array.isArray(result.books)) {
              setSavedBooks(result.books);
            }
            setIsLoaded(true);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setIsLoaded(true);
          }
        });
    } else {
      const timer = setTimeout(() => {
        if (!isCancelled) {
          setSavedBooks([]);
          setIsLoaded(true);
        }
      }, 0);

      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [token, isAuthenticated]);

  const savedBookIds = useMemo(() => {
    return savedBooks.map((b) => String(b.id));
  }, [savedBooks]);

  const isBookSaved = useCallback(
    (id: string | number) => savedBookIds.includes(String(id)),
    [savedBookIds]
  );

  const toggleSaveBook = useCallback(
    async (book: BookItem): Promise<{ success: boolean; error?: string }> => {
      const activeToken = token || getClientCookie(AUTH_TOKEN_COOKIE);
      if (!activeToken) {
        return { success: false, error: "UNAUTHORIZED" };
      }

      const bookIdStr = String(book.id);
      const isCurrentlySaved = savedBookIds.includes(bookIdStr);

      // Optimistic update
      const previousBooks = savedBooks;
      if (isCurrentlySaved) {
        setSavedBooks((prev) => prev.filter((b) => String(b.id) !== bookIdStr));
      } else {
        setSavedBooks((prev) => [book, ...prev]);
      }

      try {
        const result = await toggleFavoriteAction(book.id, activeToken);

        if (result.success) {
          return { success: true };
        }

        // Direct fetch fallback
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://ch-library.eladrabarakelkhyam.com";
        const numericId = Number(book.id);
        const idToSend = !isNaN(numericId) && numericId > 0 ? numericId : book.id;

        const res = await fetch(`${apiUrl}/api/library/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({ book_id: idToSend }),
        });

        if (res.ok) {
          return { success: true };
        }

        // Revert on error
        setSavedBooks(previousBooks);
        return { success: false, error: result.message || "فشل تحديث المفضلة" };
      } catch {
        // Direct fetch attempt on catch
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            "https://ch-library.eladrabarakelkhyam.com";
          const numericId = Number(book.id);
          const idToSend = !isNaN(numericId) && numericId > 0 ? numericId : book.id;

          const res = await fetch(`${apiUrl}/api/library/favorites`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${activeToken}`,
            },
            body: JSON.stringify({ book_id: idToSend }),
          });

          if (res.ok) {
            return { success: true };
          }
        } catch {
          // ignore
        }

        // Revert on error
        setSavedBooks(previousBooks);
        return { success: false, error: "فشل تحديث المفضلة" };
      }
    },
    [token, savedBookIds, savedBooks]
  );

  const removeBook = useCallback(
    async (id: string | number): Promise<{ success: boolean; error?: string }> => {
      const activeToken = token || getClientCookie(AUTH_TOKEN_COOKIE);
      if (!activeToken) {
        return { success: false, error: "UNAUTHORIZED" };
      }

      const bookIdStr = String(id);
      const previousBooks = savedBooks;
      setSavedBooks((prev) => prev.filter((b) => String(b.id) !== bookIdStr));

      try {
        const result = await toggleFavoriteAction(id, activeToken);
        if (!result.success) {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            "https://ch-library.eladrabarakelkhyam.com";
          const numericId = Number(id);
          const idToSend = !isNaN(numericId) && numericId > 0 ? numericId : id;
          const res = await fetch(`${apiUrl}/api/library/favorites`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${activeToken}`,
            },
            body: JSON.stringify({ book_id: idToSend }),
          });
          if (!res.ok) {
            setSavedBooks(previousBooks);
            return { success: false, error: result.message };
          }
        }
        return { success: true };
      } catch {
        setSavedBooks(previousBooks);
        return { success: false, error: "فشل إزالة الكتاب من المفضلة" };
      }
    },
    [token, savedBooks]
  );

  const clearLibrary = useCallback(() => {
    setSavedBooks([]);
  }, []);

  const value = useMemo(
    () => ({
      savedBookIds,
      savedBooks,
      totalSavedCount: savedBooks.length,
      isBookSaved,
      toggleSaveBook,
      removeBook,
      clearLibrary,
      isLoaded,
      refreshLibrary: fetchLibrary,
    }),
    [
      savedBookIds,
      savedBooks,
      isBookSaved,
      toggleSaveBook,
      removeBook,
      clearLibrary,
      isLoaded,
      fetchLibrary,
    ]
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
