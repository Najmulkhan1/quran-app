"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Search, Settings, ChevronLeft, ChevronRight, Home, BookMarked } from "lucide-react";
import IconSidebar from "./IconSidebar";
import SurahSidebar from "./SurahSidebar";
import FontSettingsPanel from "@/components/ui/FontSettingsPanel";
import SearchBar from "@/components/ui/SearchBar";
import AudioPlayerBar from "@/components/audio/AudioPlayerBar";
import { useFontSettings } from "@/context/FontSettingsContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { Surah } from "@/lib/types";

interface MainLayoutProps {
  children: React.ReactNode;
  surahs: Surah[];
  activeSurahId: number;
}

export default function MainLayout({ children, surahs, activeSurahId }: MainLayoutProps) {
  const [surahSidebarOpen, setSurahSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { count: bookmarkCount } = useBookmarks();

  const { 
    settings, 
    setArabicFont, 
    setArabicSize, 
    setTranslationSize, 
    setTranslationLanguage,
    setSelectedBanglaTranslators,
    setViewMode
  } = useFontSettings();

  // Detect mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSurahSidebarOpen(false);
      else setSurahSidebarOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const contentMargin = isMobile
    ? "ml-0"
    : surahSidebarOpen
    ? "ml-[340px] mr-[300px]"
    : "ml-[60px] mr-[300px]";

  return (
    <div className="min-h-screen bg-app">
      {/* Desktop Icon Sidebar */}
      {!isMobile && (
        <IconSidebar
          onSearchClick={() => setSearchOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
          onSurahListClick={() => setSurahSidebarOpen((p) => !p)}
          activeSurahId={activeSurahId}
        />
      )}

      {/* Surah Sidebar */}
      <SurahSidebar
        surahs={surahs}
        activeSurahId={activeSurahId}
        isOpen={isMobile ? mobileDrawerOpen : surahSidebarOpen}
        onClose={() => (isMobile ? setMobileDrawerOpen(false) : setSurahSidebarOpen(false))}
        isMobile={isMobile}
      />

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${contentMargin} min-h-screen pb-24`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-app/90 backdrop-blur-md border-b border-active px-4 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            {isMobile && (
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-tertiary transition-colors"
              >
                <Menu size={20} />
              </button>
            )}

            {/* Desktop toggle */}
            {!isMobile && (
              <button
                onClick={() => setSurahSidebarOpen((p) => !p)}
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-tertiary transition-colors"
                title="Toggle sidebar"
              >
                {surahSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            )}

            <span className="text-sm text-muted hidden sm:block">
              القرآن الكريم
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-muted hover:text-primary hover:bg-tertiary transition-colors"
              title="Search"
            >
              <Search size={20} />
            </button>

            {/* Mobile Settings Toggle */}
            {isMobile && (
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded-lg text-muted hover:text-primary hover:bg-tertiary transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            )}

            {/* Support Us Button */}
            <button className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-green text-white rounded-full text-xs font-bold shadow-lg shadow-green/20 hover:scale-105 transition-all">
              Support Us <span className="text-[10px]">🤍</span>
            </button>
          </div>
        </header>

        {/* Page content with font settings injected */}
        <div className="px-4 py-6 max-w-3xl mx-auto">
          {/* Pass font settings via CSS variables */}
          <div
            style={{
              "--arabic-size": `${settings.arabicSize}px`,
              "--translation-size": `${settings.translationSize}px`,
              "--arabic-font": (() => {
                switch (settings.arabicFont) {
                  case "Amiri": return "'Amiri', serif";
                  case "Scheherazade":
                  case "Uthmanic": return "'Scheherazade New', serif";
                  case "KFGQ": return "'KFGQ', serif";
                  case "KFGQV2": return "'KFGQV2', serif";
                  case "MeQuran": return "'MeQuran', serif";
                  case "AlMushaf": return "'AlMushaf', serif";
                  case "PDMSaleem": return "'PDMSaleem', serif";
                  case "PDMSIslamic": return "'PDMSIslamic', serif";
                  case "AlQalam": return "'AlQalam', serif";
                  default: return "'Amiri', serif";
                }
              })(),
            } as React.CSSProperties}
          >
            {children}
          </div>
        </div>
      </main>

      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Right Sidebar for Desktop */}
      {!isMobile && (
        <aside className="fixed right-0 top-0 h-screen w-[300px] bg-card border-l border-white/5 z-20 flex flex-col shadow-2xl">
          <FontSettingsPanel
            isOpen={true}
            onClose={() => {}}
            isSidebar={true}
            arabicFont={settings.arabicFont}
            arabicSize={settings.arabicSize}
            translationSize={settings.translationSize}
            translationLanguage={settings.translationLanguage}
            selectedBanglaTranslators={settings.selectedBanglaTranslators}
            onArabicFontChange={setArabicFont}
            onArabicSizeChange={setArabicSize}
            onTranslationSizeChange={setTranslationSize}
            onTranslationLanguageChange={setTranslationLanguage}
            onSelectedBanglaTranslatorsChange={setSelectedBanglaTranslators}
            viewMode={settings.viewMode}
            onViewModeChange={setViewMode}
          />
        </aside>
      )}

      {/* Mobile Settings Modal */}
      {isMobile && (
        <FontSettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          arabicFont={settings.arabicFont}
          arabicSize={settings.arabicSize}
          translationSize={settings.translationSize}
          translationLanguage={settings.translationLanguage}
          selectedBanglaTranslators={settings.selectedBanglaTranslators}
          onArabicFontChange={setArabicFont}
          onArabicSizeChange={setArabicSize}
          onTranslationSizeChange={setTranslationSize}
          onTranslationLanguageChange={setTranslationLanguage}
          onSelectedBanglaTranslatorsChange={setSelectedBanglaTranslators}
          viewMode={settings.viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      <AudioPlayerBar />

      {/* Mobile Bottom Navigation Bar */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-white/5 px-6 py-3 z-30 flex items-center justify-between safe-area-inset-bottom">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-1 text-muted hover:text-green transition-colors"
          >
            <Home size={20} />
            <span className="text-[10px] font-bold">Surahs</span>
          </button>
          
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center gap-1 text-muted hover:text-green transition-colors"
          >
            <Search size={20} />
            <span className="text-[10px] font-bold">Search</span>
          </button>

          <Link
            href="/bookmarks"
            className="flex flex-col items-center gap-1 text-muted hover:text-green transition-colors relative"
          >
            <BookMarked size={20} />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-green text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 ring-1 ring-card">
                {bookmarkCount}
              </span>
            )}
            <span className="text-[10px] font-bold">Bookmarks</span>
          </Link>

          <button
            onClick={() => setSettingsOpen(true)}
            className="flex flex-col items-center gap-1 text-muted hover:text-green transition-colors"
          >
            <Settings size={20} />
            <span className="text-[10px] font-bold">Settings</span>
          </button>
        </nav>
      )}
    </div>
  );
}
