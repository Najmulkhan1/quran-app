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
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] min-h-[60px]">
        <h2 className="text-sm font-semibold text-[#e6edf3]">Surahs</h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#636e7b] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-[#30363d]">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#636e7b]"
          />
          <input
            type="text"
            placeholder="Search surah..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#e6edf3] placeholder-[#636e7b] focus:outline-none focus:border-[#d4a843] transition-colors"
          />
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#636e7b] hover:text-[#e6edf3]"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Surah List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-[#636e7b] text-sm">
            No surahs found
          </div>
        ) : (
          <ul>
            {filtered.map((surah) => {
              const isActive = surah.id === activeSurahId;
              return (
                <li key={surah.id}>
                  <Link
                    href={`/surah/${surah.id}`}
                    ref={isActive ? activeRef : undefined}
                    onClick={isMobile ? onClose : undefined}
                    className={`surah-item flex items-center gap-3 px-4 py-2.5 border-b border-[#1e2329] cursor-pointer ${
                      isActive
                        ? "bg-[rgba(212,168,67,0.08)] border-l-2 border-l-[#d4a843]"
                        : "hover:bg-[#21262d] border-l-2 border-l-transparent"
                    }`}
                  >
                    {/* Number */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isActive
                          ? "bg-[#d4a843] text-[#0d1117]"
                          : "bg-[#21262d] text-[#848d97]"
                      }`}
                    >
                      {surah.id}
                    </div>

                    {/* Names */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium truncate ${
                            isActive ? "text-[#d4a843]" : "text-[#e6edf3]"
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
                        <span className="text-xs text-[#636e7b] truncate">
                          {surah.translation}
                        </span>
                        <span
                          className={`text-xs flex-shrink-0 ml-1 px-1.5 py-0.5 rounded text-[10px] ${
                            surah.type === "meccan"
                              ? "bg-[#21262d] text-[#636e7b]"
                              : "bg-[rgba(212,168,67,0.1)] text-[#d4a843]"
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
          className={`fixed top-0 left-0 h-screen w-[300px] bg-[#161b22] z-50 transition-transform duration-300 ${
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
      className={`fixed top-0 left-[60px] h-screen w-[280px] bg-[#161b22] border-r border-[#30363d] z-20 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {content}
    </aside>
  );
}
