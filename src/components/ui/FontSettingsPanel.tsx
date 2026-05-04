"use client";
import { X, Type, AlignLeft, Globe, Sun, Moon, Monitor } from "lucide-react";
import { ArabicFont, TranslationLanguage, BENGALI_TRANSLATORS } from "@/lib/types";
import { useTheme } from "next-themes";

interface FontSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  arabicFont: ArabicFont;
  arabicSize: number;
  translationSize: number;
  translationLanguage: TranslationLanguage;
  selectedBanglaTranslators: string[];
  onArabicFontChange: (f: ArabicFont) => void;
  onArabicSizeChange: (n: number) => void;
  onTranslationSizeChange: (n: number) => void;
  onTranslationLanguageChange: (lang: TranslationLanguage) => void;
  onSelectedBanglaTranslatorsChange: (translators: string[]) => void;
}

const FONTS: { value: ArabicFont; label: string; sample: string; css: string }[] = [
  { value: "Amiri", label: "Amiri", sample: "بِسْمِ اللَّهِ", css: "'Amiri', serif" },
  { value: "Scheherazade", label: "Scheherazade", sample: "بِسْمِ اللَّهِ", css: "'Scheherazade New', serif" },
  { value: "Uthmanic", label: "Uthmanic", sample: "بِسْمِ اللَّهِ", css: "'Scheherazade New', serif" },
  { value: "KFGQ", label: "KFGQ", sample: "بِسْمِ اللَّهِ", css: "'KFGQ', serif" },
  { value: "KFGQV2", label: "KFGQ V2", sample: "بِسْمِ اللَّهِ", css: "'KFGQV2', serif" },
  { value: "MeQuran", label: "Me Quran", sample: "بِسْمِ اللَّهِ", css: "'MeQuran', serif" },
  { value: "AlMushaf", label: "Al Mushaf", sample: "بِسْمِ اللَّهِ", css: "'AlMushaf', serif" },
  { value: "PDMSaleem", label: "PDMS Saleem", sample: "بِسْمِ اللَّهِ", css: "'PDMSaleem', serif" },
  { value: "PDMSIslamic", label: "PDMS Islamic", sample: "بِسْمِ اللَّهِ", css: "'PDMSIslamic', serif" },
  { value: "AlQalam", label: "Al Qalam", sample: "بِسْمِ اللَّهِ", css: "'AlQalam', serif" },
];

export default function FontSettingsPanel({
  isOpen,
  onClose,
  arabicFont,
  arabicSize,
  translationSize,
  translationLanguage,
  selectedBanglaTranslators,
  onArabicFontChange,
  onArabicSizeChange,
  onTranslationSizeChange,
  onTranslationLanguageChange,
  onSelectedBanglaTranslatorsChange,
}: FontSettingsPanelProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const toggleTranslator = (id: string) => {
    if (selectedBanglaTranslators.includes(id)) {
      // Don't allow deselecting all
      if (selectedBanglaTranslators.length > 1) {
        onSelectedBanglaTranslatorsChange(selectedBanglaTranslators.filter((t) => t !== id));
      }
    } else {
      onSelectedBanglaTranslatorsChange([...selectedBanglaTranslators, id]);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-4 top-16 w-[320px] bg-card rounded-2xl shadow-2xl z-50 animate-fade-in flex flex-col max-h-[85vh]">
        {/* Header — always visible */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Type size={16} className="text-gold" />
            Settings & Tafsir
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-tertiary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-5 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          
          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sun size={12} />
              Theme Appearance
            </label>
            <div className="flex bg-tertiary p-1 rounded-xl">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-card text-gold shadow-sm"
                        : "text-muted hover:text-primary"
                    }`}
                  >
                    <Icon size={14} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Translation Language */}
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe size={12} />
              Translation Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "english" as const, label: "EN" },
                { value: "bangla" as const, label: "BN" },
                { value: "both" as const, label: "Both" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onTranslationLanguageChange(option.value)}
                  className={`px-2 py-2 rounded-lg transition-all text-[10px] font-bold ${
                    translationLanguage === option.value
                      ? "bg-gold/10 text-gold"
                      : "bg-tertiary text-secondary hover:text-primary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bengali Translators (Multi-select like Tafsir) */}
          {(translationLanguage === "bangla" || translationLanguage === "both") && (
            <div>
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlignLeft size={12} />
                Bengali Translators (Tafsir)
              </label>
              <div className="space-y-1.5">
                {BENGALI_TRANSLATORS.map((translator) => (
                  <button
                    key={translator.id}
                    onClick={() => toggleTranslator(translator.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      selectedBanglaTranslators.includes(translator.id)
                        ? "bg-gold/10 text-gold"
                        : "bg-tertiary text-secondary"
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                      selectedBanglaTranslators.includes(translator.id)
                        ? "bg-gold border-gold"
                        : "border-[#484f58]"
                    }`}>
                      {selectedBanglaTranslators.includes(translator.id) && (
                        <div className="w-1.5 h-1.5 bg-app rounded-full" />
                      )}
                    </div>
                    <span className="text-[11px] font-medium leading-tight">{translator.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Arabic Font Selection */}
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
              Arabic Font
            </label>
            <div className="space-y-2">
              {FONTS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => onArabicFontChange(font.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    arabicFont === font.value
                      ? "bg-gold/10 text-gold"
                      : "bg-tertiary text-secondary hover:text-primary"
                  }`}
                >
                  <span className="text-xs font-medium">{font.label}</span>
                  <span
                    className="text-lg"
                    style={{
                      fontFamily: font.css,
                    }}
                  >
                    {font.sample}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Arabic Font Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Type size={12} />
                Arabic Size
              </label>
              <span className="text-xs font-mono text-gold bg-tertiary px-2 py-0.5 rounded">
                {arabicSize}px
              </span>
            </div>
            <input
              type="range"
              min={18}
              max={80}
              step={2}
              value={arabicSize}
              onChange={(e) => onArabicSizeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-tertiary rounded-lg appearance-none cursor-pointer accent-[#d4a843]"
            />
            {/* Preview */}
            <div
              className="mt-3 p-4 bg-app rounded-lg text-right text-primary overflow-hidden"
              style={{
                fontSize: `${arabicSize}px`,
                fontFamily: FONTS.find(f => f.value === arabicFont)?.css || "'Amiri', serif",
                direction: "rtl",
                lineHeight: 1.8,
                minHeight: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              بِسْمِ اللَّهِ
            </div>
          </div>

          {/* Translation Font Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <AlignLeft size={12} />
                Translation Size
              </label>
              <span className="text-xs font-mono text-gold bg-tertiary px-2 py-0.5 rounded">
                {translationSize}px
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={32}
              step={1}
              value={translationSize}
              onChange={(e) => onTranslationSizeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-tertiary rounded-lg appearance-none cursor-pointer accent-[#d4a843]"
            />
            {/* Preview */}
            <div
              className="mt-3 p-3 bg-app rounded-lg text-secondary"
              style={{ 
                fontSize: `${translationSize}px`, 
                lineHeight: 1.6,
                minHeight: "50px"
              }}
            >
              In the name of Allah, the Entirely Merciful.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
