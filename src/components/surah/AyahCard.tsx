"use client";
import { Play, Square, Loader2, BookMarked } from "lucide-react";
import { Verse, TranslationLanguage, VerseWords, VerseTiming } from "@/lib/types";
import { ArabicFont } from "@/lib/types";
import { useBookmarks } from "@/context/BookmarkContext";

interface AyahCardProps {
  verse: Verse;
  surahId: number;
  surahName: string;
  surahTranslation: string;
  arabicFont: ArabicFont;
  arabicSize: number;
  translationSize: number;
  translationLanguage: TranslationLanguage;
  isPlaying: boolean;
  isLoading: boolean;
  verseTiming?: VerseTiming;
  verseWords?: VerseWords;
  currentTimeMs?: number;
  onPlay: () => void;
}

export default function AyahCard({
  verse,
  surahId,
  surahName,
  surahTranslation,
  arabicFont,
  arabicSize,
  translationSize,
  translationLanguage,
  selectedBanglaTranslators = ["taisirul"],
  isPlaying,
  isLoading,
  verseTiming,
  verseWords,
  currentTimeMs = 0,
  onPlay,
}: AyahCardProps & { selectedBanglaTranslators: string[] }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(surahId, verse.id);
  const fontClass = (() => {
    switch (arabicFont) {
      case "Amiri": return "font-amiri";
      case "Scheherazade": return "font-scheherazade";
      case "Uthmanic": return "font-uthmanic";
      case "KFGQ": return "font-kfgq";
      case "KFGQV2": return "font-kfgqv2";
      case "MeQuran": return "font-me-quran";
      case "AlMushaf": return "font-al-mushaf";
      case "PDMSaleem": return "font-pdms-saleem";
      case "PDMSIslamic": return "font-pdms-islamic";
      case "AlQalam": return "font-al-qalam";
      default: return "font-amiri";
    }
  })();

  return (
    <div
      className={`group relative rounded-xl transition-all duration-300 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(60,47,47,0.05)] ${
        isPlaying
          ? "bg-gold/10 ring-1 ring-gold/30"
          : "bg-card hover:bg-tertiary/30"
      }`}
    >
      {/* Playing indicator bar */}
      {isPlaying && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold rounded-l-xl" />
      )}

      <div className="px-5 py-5">
        {/* Top row: verse number + actions */}
        <div className="flex items-center justify-between mb-4">
          {/* Verse number */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                isPlaying
                  ? "bg-gold text-card"
                  : "bg-tertiary text-secondary"
              }`}
            >
              {verse.id}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() =>
                toggleBookmark({
                  surahId,
                  surahName,
                  surahTranslation,
                  verseId: verse.id,
                  arabic: verse.text,
                  translation: verse.translation,
                  bangla: verse.bangla,
                  banglaTranslations: verse.banglaTranslations as any,
                })
              }
              className={`p-1.5 rounded-lg transition-all ${
                bookmarked
                  ? "text-gold bg-[rgba(212,168,67,0.15)]"
                  : "text-muted hover:text-gold hover:bg-tertiary"
              }`}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <BookMarked size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onPlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isPlaying
                  ? "bg-gold text-[#0d1117]"
                  : "bg-tertiary text-secondary hover:text-primary hover:bg-hover"
              }`}
              title={isPlaying ? "Stop" : "Play"}
            >
              {isLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : isPlaying ? (
                <Square size={13} fill="currentColor" />
              ) : (
                <Play size={13} fill="currentColor" />
              )}
              {isPlaying ? "Stop" : "Play"}
            </button>
          </div>
        </div>

        <div
          className={`arabic-text ${fontClass} text-primary mb-5 leading-[2.4] flex flex-wrap justify-start gap-x-2 gap-y-3`}
          style={{ fontSize: `${arabicSize}px` }}
          dir="rtl"
        >
          {verseWords ? (
            verseWords.words.map((word) => {
              if (word.char_type_name === "end") {
                return (
                  <span
                    key={word.id}
                    className="inline-flex items-center justify-center mx-1 text-gold"
                    style={{ fontFamily: "'Amiri', serif", fontSize: `${arabicSize * 0.6}px` }}
                  >
                    ﴿{verse.id}﴾
                  </span>
                );
              }

              // Check if this word is active
              const segment = verseTiming?.segments.find(s => s[0] === word.position);
              const isWordActive = isPlaying && segment && currentTimeMs >= segment[1] && currentTimeMs <= segment[2];

              return (
                <span
                  key={word.id}
                  className={`transition-all duration-200 ${
                    isWordActive ? "text-gold" : ""
                  }`}
                  style={isWordActive ? { textShadow: "0 0 15px rgba(212,168,67,0.3)" } : {}}
                >
                  {word.text_uthmani}
                </span>
              );
            })
          ) : (
            <>
              {verse.text}
              <span
                className="inline-flex items-center justify-center mx-2 text-gold"
                style={{ fontFamily: "'Amiri', serif", fontSize: `${arabicSize * 0.6}px` }}
              >
                ﴿{verse.id}﴾
              </span>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-active/20 mb-4" />

        {/* Translations */}
        {(translationLanguage === "english" || translationLanguage === "both") && (
          <div className="mb-4">
            <p className="text-[10px] text-muted mb-1.5 font-bold uppercase tracking-wider">English (Abdul Haleem)</p>
            <p
              className="text-primary/80 leading-relaxed"
              style={{ fontSize: `${translationSize}px` }}
            >
              {verse.translation}
            </p>
          </div>
        )}

        {(translationLanguage === "bangla" || translationLanguage === "both") && (
          <div className="space-y-4">
            {verse.banglaTranslations && verse.banglaTranslations.length > 0 ? (
              verse.banglaTranslations
                .filter(t => selectedBanglaTranslators.includes(t.id))
                .map((t, idx) => (
                  <div key={t.id} className={`${idx > 0 ? "pt-4 border-t border-active/50" : ""}`}>
                    <p className="text-[10px] text-gold mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                      {t.name}
                    </p>
                    <p
                      className="text-secondary leading-relaxed"
                      style={{ fontSize: `${translationSize}px`, lineHeight: "1.8", fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {t.text}
                    </p>
                  </div>
                ))
            ) : verse.bangla ? (
              <div>
                <p className="text-[10px] text-gold mb-1.5 font-bold uppercase tracking-wider">Bengali</p>
                <p
                  className="text-secondary leading-relaxed"
                  style={{ fontSize: `${translationSize}px`, lineHeight: "1.8", fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  {verse.bangla}
                </p>
              </div>
            ) : (
              <p className="text-muted italic text-xs">
                বাংলা অনুবাদ লোড হচ্ছে...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
