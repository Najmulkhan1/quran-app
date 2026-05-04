"use client";
import { useState, useEffect } from "react";
import { Menu, Search, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import IconSidebar from "./IconSidebar";
import SurahSidebar from "./SurahSidebar";
import FontSettingsPanel from "@/components/ui/FontSettingsPanel";
import SearchBar from "@/components/ui/SearchBar";
import AudioPlayerBar from "@/components/audio/AudioPlayerBar";
import { useFontSettings } from "@/context/FontSettingsContext";
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

  const { 
    settings, 
    setArabicFont, 
    setArabicSize, 
    setTranslationSize, 
    setTranslationLanguage,
    setSelectedBanglaTranslators 
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
    ? "ml-[340px]"
    : "ml-[60px]";

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
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-card border border-default rounded-lg text-xs text-muted hover:text-primary hover:border-[#636e7b] transition-colors"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline bg-tertiary px-1.5 py-0.5 rounded text-[10px]">
                ⌘K
              </kbd>
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-muted hover:text-primary hover:bg-tertiary transition-colors"
              title="Font Settings"
            >
              <Settings size={18} />
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

      {/* Modals */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
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
      />

      <AudioPlayerBar />
    </div>
  );
}
