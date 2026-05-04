import { getAllSurahs } from "@/lib/quran";
import MainLayout from "@/components/layout/MainLayout";
import SearchPageClient from "@/components/ui/SearchPageClient";

export default function SearchPage() {
  const surahs = getAllSurahs();
  return (
    <MainLayout surahs={surahs} activeSurahId={0}>
      <SearchPageClient />
    </MainLayout>
  );
}
