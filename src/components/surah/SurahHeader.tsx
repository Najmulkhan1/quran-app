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
    <div className="relative overflow-hidden rounded-xl mb-6 bg-gradient-to-br from-[#1a2234] via-[#161b22] to-[#0d1117] border border-[#30363d]">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a843] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4a843] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative px-6 py-8 text-center">
        {/* Arabic name */}
        <div
          className="text-5xl text-[#d4a843] mb-2 leading-relaxed"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {surah.name}
        </div>

        {/* English name */}
        <h1 className="text-xl font-semibold text-[#e6edf3] mb-1">
          {surah.transliteration}
        </h1>
        <p className="text-sm text-[#848d97] mb-5">{surah.translation}</p>

        {/* Meta badges */}
        <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-[#848d97] bg-[#21262d] px-3 py-1.5 rounded-full border border-[#30363d]">
            <Hash size={12} className="text-[#d4a843]" />
            Surah {surah.id}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#848d97] bg-[#21262d] px-3 py-1.5 rounded-full border border-[#30363d]">
            <MapPin size={12} className="text-[#d4a843]" />
            {surah.type === "meccan" ? "Makkah" : "Madinah"}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#848d97] bg-[#21262d] px-3 py-1.5 rounded-full border border-[#30363d]">
            <span className="text-[#d4a843]">📖</span>
            {surah.total_verses} Verses
          </span>
        </div>

        {/* Play All button */}
        <button
          onClick={onPlayAll}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            isPlayingAll
              ? "bg-[#d4a843] text-[#0d1117] shadow-lg shadow-[rgba(212,168,67,0.3)]"
              : "bg-[#21262d] text-[#e6edf3] border border-[#30363d] hover:bg-[#30363d] hover:border-[#d4a843]"
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
            className="mt-6 pt-5 border-t border-[#30363d] text-3xl text-[#d4a843]"
            style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
      </div>
    </div>
  );
}
