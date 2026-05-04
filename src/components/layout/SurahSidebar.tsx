"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Surah } from "@/lib/types";

interface SurahSidebarProps {
  surahs: Surah[];
  activeSurahId: number;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export default function SurahSidebar({
  surahs,
  activeSurahId,
  isOpen,
  onClose,
  isMobile = false,
}: SurahSidebarProps) {
  const [filter, setFilter] = useState("");
  const activeRef = useRef<HTMLAnchorElement>(null);

  const filtered = surahs.filter(
    (s) =>
      !filter ||
      s.transliteration.toLowerCase().includes(filter.toLowerCase()) ||
      s.translation.toLowerCase().includes(filter.toLowerCase()) ||
      String(s.id).includes(filter)
  );

  // Scroll active surah into view on open
  useEffect(() => {
    if (isOpen && activeRef.current) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, activeSurahId]);

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 min-h-[60px]">
        <h2 className="text-sm font-semibold text-primary">Surahs</h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-tertiary transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="relative group">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-green transition-colors"
          />
          <input
            type="text"
            placeholder="Search surah..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-app border border-default rounded-full pl-9 pr-8 py-2 text-xs text-primary placeholder-[#636e7b] focus:outline-none focus:border-green focus:ring-1 focus:ring-green/30 transition-all shadow-inner"
          />
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Surah List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-muted text-sm">
            No surahs found
          </div>
        ) : (
          <ul className="p-2 space-y-1">
            {filtered.map((surah) => {
              const isActive = surah.id === activeSurahId;
              return (
                <li key={surah.id}>
                  <Link
                    href={`/surah/${surah.id}`}
                    ref={isActive ? activeRef : undefined}
                    onClick={isMobile ? onClose : undefined}
                    className={`surah-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-green/10 text-green"
                        : "hover:bg-tertiary/80 text-primary"
                    }`}
                  >
                    {/* Number */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isActive
                          ? "bg-green text-white"
                          : "bg-tertiary text-secondary"
                      }`}
                    >
                      {surah.id}
                    </div>

                    {/* Names */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-bold truncate ${
                            isActive ? "text-green" : "text-primary"
                          }`}
                        >
                          {surah.transliteration}
                        </span>
                        <span
                          className="text-base ml-2 flex-shrink-0"
                          style={{ fontFamily: "'Amiri', serif" }}
                        >
                          {surah.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-muted truncate">
                          {surah.translation}
                        </span>
                        <span
                          className={`text-[10px] flex-shrink-0 ml-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                            surah.type === "meccan"
                              ? "bg-tertiary text-secondary"
                              : "bg-green/20 text-green"
                          }`}
                        >
                          {surah.total_verses}v
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-screen w-[300px] bg-card z-50 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={`fixed top-0 left-[60px] h-screen w-[280px] bg-card z-20 transition-transform duration-300 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {content}
    </aside>
  );
}
