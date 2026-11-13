"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { BookItem } from "@/data/books.data";

const STORAGE_KEY = "kalmch_library_saved_books";

interface LibraryContextType {
  savedBookIds: string[];
  savedBooks: BookItem[];
  totalSavedCount: number;
  isBookSaved: (id: string) => boolean;
  toggleSaveBook: (book: BookItem) => void;
  removeBook: (id: string) => void;
  clearLibrary: () => void;
  isLoaded: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("kalmch_library_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("kalmch_library_change", callback);
  };
}

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kalmch_library_change"));
  }
}

function getSnapshot(): string {
  if (typeof window === "undefined") {
    return "[]";
  }
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const rawSaved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const savedBooks: BookItem[] = useMemo(() => {
    try {
      const parsed = JSON.parse(rawSaved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [rawSaved]);

  const savedBookIds = useMemo(() => {
    return savedBooks.map((b) => b.id);
  }, [savedBooks]);

  const persist = useCallback((books: BookItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      notifyChange();
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, []);

  const isBookSaved = useCallback(
    (id: string) => savedBookIds.includes(String(id)),
    [savedBookIds]
  );

  const toggleSaveBook = useCallback(
    (book: BookItem) => {
      let updated: BookItem[];
      if (savedBookIds.includes(String(book.id))) {
        updated = savedBooks.filter((b) => String(b.id) !== String(book.id));
      } else {
        updated = [book, ...savedBooks];
      }
      persist(updated);
    },
    [savedBookIds, savedBooks, persist]
  );

  const removeBook = useCallback(
    (id: string) => {
      const updated = savedBooks.filter((b) => String(b.id) !== String(id));
      persist(updated);
    },
    [savedBooks, persist]
  );

  const clearLibrary = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo(
    () => ({
      savedBookIds,
      savedBooks,
      totalSavedCount: savedBooks.length,
      isBookSaved,
      toggleSaveBook,
      removeBook,
      clearLibrary,
      isLoaded: true,
    }),
    [
      savedBookIds,
      savedBooks,
      isBookSaved,
      toggleSaveBook,
      removeBook,
      clearLibrary,
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
