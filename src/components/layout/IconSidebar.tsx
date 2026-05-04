"use client";
import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Settings,
  BookMarked,
  Moon,
  ChevronRight,
} from "lucide-react";

interface IconSidebarProps {
  onSearchClick: () => void;
  onSettingsClick: () => void;
  onSurahListClick: () => void;
  activeSurahId?: number;
}

export default function IconSidebar({
  onSearchClick,
  onSettingsClick,
  onSurahListClick,
}: IconSidebarProps) {
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const icons = [
    {
      id: "surahs",
      icon: <BookOpen size={20} />,
      label: "Surahs",
      onClick: onSurahListClick,
    },
    {
      id: "search",
      icon: <Search size={20} />,
      label: "Search",
      onClick: onSearchClick,
    },
    {
      id: "bookmarks",
      icon: <BookMarked size={20} />,
      label: "Bookmarks",
      onClick: () => {},
    },
    {
      id: "settings",
      icon: <Settings size={20} />,
      label: "Settings",
      onClick: onSettingsClick,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[60px] bg-[#161b22] border-r border-[#30363d] flex flex-col items-center z-30">
      {/* Logo */}
      <Link
        href="/surah/1"
        className="w-full h-[60px] flex items-center justify-center border-b border-[#30363d] hover:bg-[#21262d] transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#9c7a1f] flex items-center justify-center">
          <Moon size={16} className="text-[#0d1117]" />
        </div>
      </Link>

      {/* Nav Icons */}
      <nav className="flex-1 flex flex-col items-center py-4 gap-1 w-full">
        {icons.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveIcon(item.id);
              item.onClick();
            }}
            title={item.label}
            className={`group relative w-full h-[48px] flex items-center justify-center transition-colors cursor-pointer ${
              activeIcon === item.id
                ? "text-[#d4a843] bg-[#21262d]"
                : "text-[#636e7b] hover:text-[#e6edf3] hover:bg-[#21262d]"
            }`}
          >
            {activeIcon === item.id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#d4a843] rounded-r" />
            )}
            {item.icon}
            {/* Tooltip */}
            <span className="absolute left-[68px] bg-[#21262d] text-[#e6edf3] text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#30363d] z-50">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom toggle */}
      <div className="pb-4">
        <button
          onClick={onSurahListClick}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-[#636e7b] hover:text-[#e6edf3] hover:bg-[#21262d] transition-colors"
          title="Toggle Surah List"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </aside>
  );
}
