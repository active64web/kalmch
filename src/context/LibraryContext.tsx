"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { booksData, BookItem } from "@/data/books.data";

const STORAGE_KEY = "kalmch_library_saved";
const INITIAL_DEFAULT_IDS = ["b-1", "b-2", "b-4"];

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
    return JSON.stringify(INITIAL_DEFAULT_IDS);
  }
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_IDS));
      return JSON.stringify(INITIAL_DEFAULT_IDS);
    }
    return item;
  } catch {
    return JSON.stringify(INITIAL_DEFAULT_IDS);
  }
}

function getServerSnapshot(): string {
  return JSON.stringify(INITIAL_DEFAULT_IDS);
}

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const rawSaved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const savedBookIds: string[] = useMemo(() => {
    try {
      const parsed = JSON.parse(rawSaved);
      return Array.isArray(parsed) ? parsed : INITIAL_DEFAULT_IDS;
    } catch {
      return INITIAL_DEFAULT_IDS;
    }
  }, [rawSaved]);

  const persist = useCallback((ids: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      notifyChange();
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, []);

  const isBookSaved = useCallback(
    (id: string) => savedBookIds.includes(id),
    [savedBookIds]
  );

  const toggleSaveBook = useCallback(
    (book: BookItem) => {
      let updated: string[];
      if (savedBookIds.includes(book.id)) {
        updated = savedBookIds.filter((id) => id !== book.id);
      } else {
        updated = [book.id, ...savedBookIds];
      }
      persist(updated);
    },
    [savedBookIds, persist]
  );

  const removeBook = useCallback(
    (id: string) => {
      const updated = savedBookIds.filter((bookId) => bookId !== id);
      persist(updated);
    },
    [savedBookIds, persist]
  );

  const clearLibrary = useCallback(() => {
    persist([]);
  }, [persist]);

  const savedBooks = useMemo(() => {
    return savedBookIds
      .map((id) => booksData.find((b) => b.id === id))
      .filter((b): b is BookItem => Boolean(b));
  }, [savedBookIds]);

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
