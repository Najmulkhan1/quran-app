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
  selectedBanglaTranslators: string[];
  viewMode: "translation" | "reading";
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
  viewMode,
  selectedBanglaTranslators,
  isPlaying,
  isLoading,
  verseTiming,
  verseWords,
  currentTimeMs = 0,
  onPlay,
}: AyahCardProps) {
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
      className={`group relative rounded-xl transition-all duration-300 mb-6 flex overflow-hidden ${
        isPlaying
          ? "bg-green/5 ring-1 ring-green/20"
          : "bg-card hover:bg-tertiary/20"
      }`}
    >
      {/* Left Action Column */}
      <div className="w-14 flex flex-col items-center py-5 border-r border-white/5 bg-black/10">
        <span className="text-[10px] font-bold text-muted mb-4">{surahId}:{verse.id}</span>
        
        <button
          onClick={onPlay}
          className={`p-2 rounded-lg transition-all mb-2 ${
            isPlaying ? "text-green bg-green/10" : "text-muted hover:text-green hover:bg-tertiary"
          }`}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : isPlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>

        <button
          onClick={() => toggleBookmark({
            surahId, surahName, surahTranslation,
            verseId: verse.id, arabic: verse.text,
            translation: verse.translation, bangla: verse.bangla,
            banglaTranslations: verse.banglaTranslations as any
          })}
          className={`p-2 rounded-lg transition-all mb-2 ${
            bookmarked ? "text-green bg-green/10" : "text-muted hover:text-green hover:bg-tertiary"
          }`}
        >
          <BookMarked size={16} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex-1 px-6 py-6">


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
                    className="inline-flex items-center justify-center mx-2 text-green"
                    style={{ fontFamily: "'Amiri', serif", fontSize: `${arabicSize * 0.7}px` }}
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
                    isWordActive ? "text-green" : ""
                  }`}
                  style={isWordActive ? { textShadow: "0 0 15px rgba(46,125,50,0.3)" } : {}}
                >
                  {word.text_uthmani}
                </span>
              );
            })
          ) : (
            <>
              {verse.text}
              <span
                className="inline-flex items-center justify-center mx-3 text-green"
                style={{ fontFamily: "'Amiri', serif", fontSize: `${arabicSize * 0.7}px` }}
              >
                ﴿{verse.id}﴾
              </span>
            </>
          )}
        </div>

        {/* Divider */}
        {viewMode === "translation" && (
          <div className="h-px bg-active/20 mb-4" />
        )}

        {/* Translations Section */}
        {viewMode === "translation" && (
          <div className="space-y-4">
            {(translationLanguage === "english" || translationLanguage === "both") && (
              <div className="p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 transition-all hover:border-green/20 group/eng">
                <p className="text-[10px] text-muted mb-2 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green/40 group-hover/eng:bg-green" />
                  English (Abdul Haleem)
                </p>
                <p
                  className="text-primary/90 leading-relaxed"
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
                    .map((t) => (
                      <div key={t.id} className="p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 transition-all hover:border-green/20 group/bn">
                        <p className="text-[10px] text-green/60 mb-2 font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green/40 group-hover/bn:bg-green" />
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
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 transition-all hover:border-green/20 group/bn">
                    <p className="text-[10px] text-green/60 mb-2 font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green/40 group-hover/bn:bg-green" />
                      Mujibur Rahman
                    </p>
                    <p
                      className="text-secondary leading-relaxed"
                      style={{ fontSize: `${translationSize}px`, lineHeight: "1.8", fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {verse.bangla}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5">
                    <p className="text-muted italic text-xs">
                      বাংলা অনুবাদ লোড হচ্ছে...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
