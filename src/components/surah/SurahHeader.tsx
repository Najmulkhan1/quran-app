"use client";
import { MapPin, Hash, Play, Square } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-xl mb-6 bg-gradient-to-br from-[#fdfbf7] via-[#f5f0e1] to-[#ede4cc] dark:from-[#1a2234] dark:via-[#161b22] dark:to-[#0d1117]">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative px-6 py-8 text-center">
        {/* Arabic name */}
        <div
          className="text-5xl text-gold mb-2 leading-relaxed"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {surah.name}
        </div>

        {/* English name */}
        <h1 className="text-xl font-semibold text-primary mb-1">
          {surah.transliteration}
        </h1>
        <p className="text-sm text-secondary mb-5">{surah.translation}</p>

        {/* Meta badges */}
        <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-secondary bg-tertiary px-3 py-1.5 rounded-full border border-default">
            <Hash size={12} className="text-gold" />
            Surah {surah.id}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-secondary bg-tertiary px-3 py-1.5 rounded-full border border-default">
            <MapPin size={12} className="text-gold" />
            {surah.type === "meccan" ? "Makkah" : "Madinah"}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-secondary bg-tertiary px-3 py-1.5 rounded-full border border-default">
            <span className="text-gold">📖</span>
            {surah.total_verses} Verses
          </span>
        </div>

        {/* Play All button */}
        <button
          onClick={onPlayAll}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            isPlayingAll
              ? "bg-gold text-[#0d1117] shadow-lg shadow-[rgba(212,168,67,0.3)]"
              : "bg-tertiary text-primary border border-default hover:bg-hover hover:border-gold"
          }`}
        >
          {isPlayingAll ? (
            <>
              <Square size={14} fill="currentColor" />
              Stop Recitation
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              Play Full Surah
            </>
          )}
        </button>

        {/* Bismillah — shown for all surahs except 1 and 9 */}
        {surah.id !== 1 && surah.id !== 9 && (
          <div
            className="mt-6 pt-5 border-t border-default text-3xl text-gold"
            style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
      </div>
    </div>
  );
}
