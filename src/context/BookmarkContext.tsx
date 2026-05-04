"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface BookmarkedAyah {
  surahId: number;
  surahName: string;        // transliteration
  surahTranslation: string;
  verseId: number;
  arabic: string;
  translation: string;
  bangla?: string;
  banglaTranslations?: { id: string; name: string; text: string }[];
  savedAt: number;          // Date.now()
}

interface BookmarkContextValue {
  bookmarks: BookmarkedAyah[];
  isBookmarked: (surahId: number, verseId: number) => boolean;
  toggleBookmark: (ayah: Omit<BookmarkedAyah, "savedAt">) => void;
  clearAll: () => void;
  count: number;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);
const STORAGE_KEY = "quran_bookmarks";

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist to localStorage whenever bookmarks change
  const persist = useCallback((next: BookmarkedAyah[]) => {
    setBookmarks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const isBookmarked = useCallback(
    (surahId: number, verseId: number) =>
      bookmarks.some((b) => b.surahId === surahId && b.verseId === verseId),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (ayah: Omit<BookmarkedAyah, "savedAt">) => {
      setBookmarks((prev) => {
        const exists = prev.some(
          (b) => b.surahId === ayah.surahId && b.verseId === ayah.verseId
        );
        const next = exists
          ? prev.filter(
              (b) => !(b.surahId === ayah.surahId && b.verseId === ayah.verseId)
            )
          : [{ ...ayah, savedAt: Date.now() }, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    []
  );

  const clearAll = useCallback(() => persist([]), [persist]);

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, isBookmarked, toggleBookmark, clearAll, count: bookmarks.length }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used inside BookmarkProvider");
  return ctx;
}
