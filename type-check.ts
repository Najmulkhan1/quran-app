import { Verse, FontSettings, TranslationLanguage } from '@/lib/types';

// Test type compilation
const verse: Verse = {
  id: 1,
  text: "Arabic text",
  translation: "English",
  bangla: "Bengali"
};

const settings: FontSettings = {
  arabicFont: "Amiri",
  arabicSize: 28,
  translationSize: 16,
  translationLanguage: "both"
};

const lang: TranslationLanguage = "bangla";

console.log("✓ All types compile successfully");
console.log(`Verse ID: ${verse.id}`);
console.log(`Bangla translation: ${verse.bangla}`);
console.log(`Language setting: ${settings.translationLanguage}`);
