"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Search,
  Settings,
  BookMarked,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import { useBookmarks } from "@/context/BookmarkContext";
import { useTheme } from "next-themes";

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
  const pathname = usePathname();
  const { count: bookmarkCount } = useBookmarks();
  const { theme, setTheme } = useTheme();

  const icons = [
    {
      id: "surahs",
      icon: <BookOpen size={20} />,
      label: "Surahs",
      onClick: onSurahListClick,
      href: undefined,
    },
    {
      id: "search",
      icon: <Search size={20} />,
      label: "Search",
      onClick: onSearchClick,
      href: undefined,
    },
    {
      id: "bookmarks",
      icon: (
        <span className="relative">
          <BookMarked size={20} />
          {bookmarkCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-gold text-[#0d1117] text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
              {bookmarkCount > 99 ? "99+" : bookmarkCount}
            </span>
          )}
        </span>
      ),
      label: "Bookmarks",
      onClick: undefined,
      href: "/bookmarks",
    },
    {
      id: "settings",
      icon: <Settings size={20} />,
      label: "Settings",
      onClick: onSettingsClick,
      href: undefined,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[60px] bg-card flex flex-col items-center z-30 shadow-lg">
      {/* Logo */}
      <Link
        href="/surah/1"
        className="w-full h-[60px] flex items-center justify-center hover:bg-tertiary/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a843] via-[#b8860b] to-[#8b6d13] flex items-center justify-center shadow-md">
          <Moon size={16} className="text-card" />
        </div>
      </Link>

      {/* Nav Icons */}
      <nav className="flex-1 flex flex-col items-center py-6 gap-3 w-full">
        {icons.map((item) => {
          const isActive =
            item.href
              ? pathname === item.href
              : activeIcon === item.id;

          const content = (
            <>
              {item.icon}
              {/* Tooltip */}
              <span className="absolute left-[68px] bg-tertiary text-primary text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-default z-50">
                {item.label}
              </span>
            </>
          );

          const cls = `group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isActive
              ? "text-card bg-gold shadow-[0_4px_12px_rgba(179,139,45,0.3)] scale-105"
              : "text-muted hover:text-primary hover:bg-tertiary/80"
          }`;

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className={cls} title={item.label}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveIcon(item.id);
                item.onClick?.();
              }}
              title={item.label}
              className={cls}
            >
              {content}
            </button>
          );
        })}
      </nav>

      {/* Bottom toggles */}
      <div className="pb-4 flex flex-col gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-muted hover:text-primary hover:bg-tertiary/80 transition-all duration-200"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={onSurahListClick}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-muted hover:text-primary hover:bg-tertiary/80 transition-all duration-200"
          title="Toggle Surah List"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </aside>
  );
}
