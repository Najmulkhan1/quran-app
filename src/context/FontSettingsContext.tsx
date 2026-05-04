"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { FontSettings, ArabicFont, TranslationLanguage } from "@/lib/types";

const DEFAULT_SETTINGS: FontSettings = {
  arabicFont: "Amiri",
  arabicSize: 28,
  translationSize: 16,
  translationLanguage: "both",
  selectedBanglaTranslators: ["taisirul"],
};

interface FontSettingsContextValue {
  settings: FontSettings;
  mounted: boolean;
  setArabicFont: (f: ArabicFont) => void;
  setArabicSize: (n: number) => void;
  setTranslationSize: (n: number) => void;
  setTranslationLanguage: (lang: TranslationLanguage) => void;
  setSelectedBanglaTranslators: (translators: string[]) => void;
}

const FontSettingsContext = createContext<FontSettingsContextValue | null>(null);

export function FontSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<FontSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("quran_fontSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all fields have valid values
        setSettings({
          arabicFont: parsed.arabicFont ?? DEFAULT_SETTINGS.arabicFont,
          arabicSize: parsed.arabicSize ?? DEFAULT_SETTINGS.arabicSize,
          translationSize: parsed.translationSize ?? DEFAULT_SETTINGS.translationSize,
          translationLanguage: parsed.translationLanguage ?? DEFAULT_SETTINGS.translationLanguage,
          selectedBanglaTranslators: parsed.selectedBanglaTranslators ?? DEFAULT_SETTINGS.selectedBanglaTranslators,
        });
      }
    } catch {
      // If localStorage is corrupted, use defaults
    }
  }, []);

  const updateSettings = useCallback((patch: Partial<FontSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem("quran_fontSettings", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const setArabicFont = useCallback((f: ArabicFont) => updateSettings({ arabicFont: f }), [updateSettings]);
  const setArabicSize = useCallback((n: number) => updateSettings({ arabicSize: Math.min(80, Math.max(16, n)) }), [updateSettings]);
  const setTranslationSize = useCallback((n: number) => updateSettings({ translationSize: Math.min(32, Math.max(12, n)) }), [updateSettings]);
  const setTranslationLanguage = useCallback((lang: TranslationLanguage) => updateSettings({ translationLanguage: lang }), [updateSettings]);
  const setSelectedBanglaTranslators = useCallback((translators: string[]) => updateSettings({ selectedBanglaTranslators: translators }), [updateSettings]);

  return (
    <FontSettingsContext.Provider
      value={{ settings, mounted, setArabicFont, setArabicSize, setTranslationSize, setTranslationLanguage, setSelectedBanglaTranslators }}
    >
      {children}
    </FontSettingsContext.Provider>
  );
}

export function useFontSettings() {
  const ctx = useContext(FontSettingsContext);
  if (!ctx) throw new Error("useFontSettings must be used inside FontSettingsProvider");
  return ctx;
}
