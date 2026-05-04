import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSurahs, getSurahById } from "@/lib/quran";
import MainLayout from "@/components/layout/MainLayout";
import SurahReader from "@/components/surah/SurahReader";

interface Props {
  params: Promise<{ id: string }>;
}

// SSG — generate all 114 surah pages at build time
export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const surah = getSurahById(parseInt(id));
  if (!surah) return { title: "Surah Not Found" };
  return {
    title: `Surah ${surah.transliteration} (${surah.id}) - Quran Mazid`,
    description: `Read Surah ${surah.transliteration} - ${surah.translation}. ${surah.total_verses} verses, revealed in ${surah.type === "meccan" ? "Makkah" : "Madinah"}.`,
  };
}

export default async function SurahPage({ params }: Props) {
  const { id } = await params;
  const surahId = parseInt(id);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound();
  }

  const surah = getSurahById(surahId);
  if (!surah) notFound();

  const allSurahs = getAllSurahs();

  return (
    <MainLayout surahs={allSurahs} activeSurahId={surahId}>
      <SurahReader surah={surah} />
    </MainLayout>
  );
}
