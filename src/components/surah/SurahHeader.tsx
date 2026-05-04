"use client";
import { Play, Square } from "lucide-react";
import { SurahWithVerses } from "@/lib/types";

interface SurahHeaderProps {
  surah: SurahWithVerses;
  onPlayAll: () => void;
  isPlayingAll: boolean;
}

export default function SurahHeader({
  surah,
  onPlayAll,
  isPlayingAll,
}: SurahHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-[#fdfbf7] to-[#f5f0e1] dark:from-[#161b22] dark:to-[#0b0e14] shadow-xl dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px]" />
      </div>

      <div className="relative px-6 py-8 text-center">
        {/* Arabic name */}
        <div
          className="text-3xl text-primary dark:text-white mb-2 leading-relaxed"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {surah.name}
        </div>

        {/* English name */}
        <h1 className="text-xl font-bold text-primary dark:text-white mb-1 tracking-tight">
          {surah.transliteration}
        </h1>
        <p className="text-[10px] text-muted mb-6 uppercase tracking-[0.2em] font-bold">
          {surah.type === "meccan" ? "Makkah" : "Madinah"} • {surah.total_verses} Verses
        </p>

        {/* Play All button */}
        <button
          onClick={onPlayAll}
          className={`inline-flex items-center gap-2 px-8 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${
            isPlayingAll
              ? "bg-green text-white shadow-xl shadow-green/30"
              : "bg-app text-primary dark:bg-white dark:text-black hover:bg-green hover:text-white border border-black/5 dark:border-none"
          }`}
        >
          {isPlayingAll ? (
            <>
              <Square size={16} fill="currentColor" />
              Stop Recitation
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Play Full Surah
            </>
          )}
        </button>

        {/* Bismillah — shown for all surahs except 1 and 9 */}
        {surah.id !== 1 && surah.id !== 9 && (
          <div
            className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 text-3xl text-green opacity-90 leading-normal"
            style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
      </div>
    </div>
  );
}
