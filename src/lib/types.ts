export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: "meccan" | "medinan";
  total_verses: number;
}

export interface Verse {
  id: number;
  text: string;
  translation: string;
  bangla?: string;
  banglaTranslations?: { id: string; name: string; text: string }[];
}

export interface SurahWithVerses extends Surah {
  verses: Verse[];
}

export interface SearchResult {
  surah_id: number;
  surah_name: string;
  surah_translation: string;
  verse_number: number;
  arabic: string;
  translation: string;
}

export interface SearchResponse {
  count: number;
  results: SearchResult[];
}

export interface Word {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: "word" | "end" | string;
  text_uthmani: string;
  translation: { text: string };
  transliteration: { text: string };
}

export interface VerseWords {
  id: number;
  verse_key: string;
  words: Word[];
}

export interface VerseTiming {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  duration: number;
  segments: [number, number, number][]; // [word_index, startMs, endMs]
}

export interface AudioFileData {
  id: number;
  chapter_id: number;
  audio_url: string;
  verse_timings: VerseTiming[];
}

export type ArabicFont = 
  | "Amiri" 
  | "Scheherazade" 
  | "Uthmanic" 
  | "KFGQ" 
  | "KFGQV2" 
  | "MeQuran" 
  | "AlMushaf" 
  | "PDMSaleem" 
  | "PDMSIslamic" 
  | "AlQalam";

export type TranslationLanguage = "english" | "bangla" | "both";

export const BENGALI_TRANSLATORS = [
  { id: "taisirul", name: "Taisirul Quran" },
  { id: "mujibur", name: "Sheikh Mujibur Rahman" },
  { id: "zakaria", name: "Dr. Abu Bakr Zakaria" },
  { id: "muhiuddin", name: "Muhiuddin Khan" }
];

export interface FontSettings {
  arabicFont: ArabicFont;
  arabicSize: number;
  translationSize: number;
  translationLanguage: TranslationLanguage;
  selectedBanglaTranslators: string[];
  viewMode: "translation" | "reading";
}

export interface AudioMetadata {
  surahId: number;
  surahName: string;
  ayahNumber?: number;
  reciterName: string;
}
