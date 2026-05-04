import { Surah, SurahWithVerses, SearchResult, BENGALI_TRANSLATORS } from "./types";
import surahsData from "@/data/surahs.json";
import quranDataEn from "@/data/quran_en.json";

import bnTaisirul from "@/data/bn_taisirul.json";
import bnMujibur from "@/data/bn_mujibur.json";
import bnZakaria from "@/data/bn_zakaria.json";
import bnMuhiuddin from "@/data/bn_muhiuddin.json";

const bnData: Record<string, any[]> = {
  taisirul: bnTaisirul,
  mujibur: bnMujibur,
  zakaria: bnZakaria,
  muhiuddin: bnMuhiuddin
};

type RawVerse = { id: number; text: string; translation: string; bangla?: string; banglaTranslations?: { id: string; name: string; text: string }[] };
type RawSurah = { id: number; verses: RawVerse[] };

// Server-side data helpers (used in API routes + SSG)
export function getAllSurahs(): Surah[] {
  return surahsData as Surah[];
}

export function getSurahById(id: number): SurahWithVerses | null {
  const meta = (surahsData as Surah[]).find((s) => s.id === id);
  if (!meta) return null;

  const enRaw = (quranDataEn as RawSurah[]).find((s) => s.id === id);
  if (!enRaw) return null;

  // Clone to avoid mutating original
  const merged: RawSurah = { ...enRaw, verses: enRaw.verses.map(v => ({ ...v })) };

  merged.verses.forEach(verse => {
    verse.banglaTranslations = [];
    for (const [key, data] of Object.entries(bnData)) {
      const surah = data.find((s: any) => s.id === id);
      if (surah) {
        const verseBn = surah.verses.find((v: any) => v.id === verse.id);
        if (verseBn && verseBn.bangla) {
          const translator = BENGALI_TRANSLATORS.find(t => t.id === key);
          verse.banglaTranslations!.push({
            id: key,
            name: translator?.name || key,
            text: verseBn.bangla
          });
        }
      }
    }
    // Set fallback bangla property to the first one for backwards compatibility if needed
    if (verse.banglaTranslations.length > 0) {
      verse.bangla = verse.banglaTranslations[0].text;
    }
  });

  return { ...meta, verses: merged.verses };
}

export function searchQuran(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  const results: SearchResult[] = [];
  const surahs = surahsData as Surah[];

  (quranDataEn as RawSurah[]).forEach((surah) => {
    const meta = surahs.find((s) => s.id === surah.id);
    if (!meta) return;

    surah.verses.forEach((verse) => {
      if (
        verse.translation?.toLowerCase().includes(q) ||
        verse.text?.includes(query)
      ) {
        results.push({
          surah_id: surah.id,
          surah_name: meta.transliteration,
          surah_translation: meta.translation,
          verse_number: verse.id,
          arabic: verse.text,
          translation: verse.translation,
        });
      }
    });
  });

  return results.slice(0, 50);
}

// Audio URL builder
export function getAudioUrl(surahId: number, ayahNumber: number): string {
  const surah = String(surahId).padStart(3, "0");
  const ayah = String(ayahNumber).padStart(3, "0");
  return `https://everyayah.com/data/Alafasy_128kbps/${surah}${ayah}.mp3`;
}

// Client-side fetch helpers
export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch("/api/surahs");
  if (!res.ok) throw new Error("Failed to fetch surahs");
  return res.json();
}

export async function fetchSurah(id: number): Promise<SurahWithVerses> {
  const res = await fetch(`/api/surah/${id}`);
  if (!res.ok) throw new Error("Failed to fetch surah");
  return res.json();
}

export async function searchAyahs(
  query: string
): Promise<{ count: number; results: SearchResult[] }> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}
