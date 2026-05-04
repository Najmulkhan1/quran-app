import { getAllSurahs } from "@/lib/quran";
import MainLayout from "@/components/layout/MainLayout";
import BookmarkPageClient from "@/components/ui/BookmarkPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks - Quran Mazid",
  description: "Your saved ayahs from the Holy Quran.",
};

export default function BookmarksPage() {
  const surahs = getAllSurahs();
  return (
    <MainLayout surahs={surahs} activeSurahId={0}>
      <BookmarkPageClient />
    </MainLayout>
  );
}
