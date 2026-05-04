"use client";
import { Play, Square, Loader2, BookMarked } from "lucide-react";
import { Verse, TranslationLanguage, VerseWords, VerseTiming } from "@/lib/types";
import { ArabicFont } from "@/lib/types";

interface AyahCardProps {
  verse: Verse;
  surahId: number;
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
      className={`group relative rounded-xl border transition-all duration-200 mb-3 ${
        isPlaying
          ? "bg-[rgba(212,168,67,0.06)] border-[rgba(212,168,67,0.3)]"
          : "bg-[#161b22] border-[#21262d] hover:border-[#30363d] hover:bg-[#1a1f27]"
      }`}
    >
      {/* Playing indicator bar */}
      {isPlaying && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d4a843] rounded-l-xl" />
      )}

      <div className="px-5 py-5">
        {/* Top row: verse number + actions */}
        <div className="flex items-center justify-between mb-4">
          {/* Verse number */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                isPlaying
                  ? "bg-[#d4a843] text-[#0d1117] border-[#d4a843]"
                  : "bg-[#21262d] text-[#848d97] border-[#30363d]"
              }`}
            >
              {verse.id}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1.5 rounded-lg text-[#636e7b] hover:text-[#d4a843] hover:bg-[#21262d] transition-colors"
              title="Bookmark"
            >
              <BookMarked size={15} />
            </button>
            <button
              onClick={onPlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isPlaying
                  ? "bg-[#d4a843] text-[#0d1117]"
                  : "bg-[#21262d] text-[#848d97] hover:text-[#e6edf3] hover:bg-[#30363d]"
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
          className={`arabic-text ${fontClass} text-[#e6edf3] mb-5 leading-[2.4] flex flex-wrap justify-start gap-x-2 gap-y-3`}
          style={{ fontSize: `${arabicSize}px` }}
          dir="rtl"
        >
          {verseWords ? (
            verseWords.words.map((word) => {
              if (word.char_type_name === "end") {
                return (
                  <span
                    key={word.id}
                    className="inline-flex items-center justify-center mx-1 text-[#d4a843]"
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
                    isWordActive ? "text-[#d4a843]" : ""
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
                className="inline-flex items-center justify-center mx-2 text-[#d4a843]"
                style={{ fontFamily: "'Amiri', serif", fontSize: `${arabicSize * 0.6}px` }}
              >
                ﴿{verse.id}﴾
              </span>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#21262d] mb-4" />

        {/* Translations */}
        {(translationLanguage === "english" || translationLanguage === "both") && (
          <div className="mb-4">
            <p className="text-[10px] text-[#636e7b] mb-1.5 font-bold uppercase tracking-wider">English (Abdul Haleem)</p>
            <p
              className="text-[#e6edf3]/80 leading-relaxed"
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
                  <div key={t.id} className={`${idx > 0 ? "pt-4 border-t border-[#21262d]/50" : ""}`}>
                    <p className="text-[10px] text-[#d4a843] mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]/40" />
                      {t.name}
                    </p>
                    <p
                      className="text-[#848d97] leading-relaxed"
                      style={{ fontSize: `${translationSize}px`, lineHeight: "1.8", fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {t.text}
                    </p>
                  </div>
                ))
            ) : verse.bangla ? (
              <div>
                <p className="text-[10px] text-[#d4a843] mb-1.5 font-bold uppercase tracking-wider">Bengali</p>
                <p
                  className="text-[#848d97] leading-relaxed"
                  style={{ fontSize: `${translationSize}px`, lineHeight: "1.8", fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  {verse.bangla}
                </p>
              </div>
            ) : (
              <p className="text-[#636e7b] italic text-xs">
                বাংলা অনুবাদ লোড হচ্ছে...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
