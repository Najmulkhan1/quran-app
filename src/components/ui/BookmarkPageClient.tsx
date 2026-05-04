"use client";
import { useState } from "react";
import { BookMarked, Trash2, ExternalLink, Search, X, Clock, Play, Square, Loader2 } from "lucide-react";
import Link from "next/link";
import { useBookmarks, BookmarkedAyah } from "@/context/BookmarkContext";
import { useFontSettings } from "@/context/FontSettingsContext";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { getAudioUrl } from "@/lib/quran";

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function BookmarkPageClient() {
  const { bookmarks, toggleBookmark, clearAll, count } = useBookmarks();
  const [search, setSearch] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = bookmarks.filter(
    (b) =>
      !search ||
      b.surahName.toLowerCase().includes(search.toLowerCase()) ||
      b.surahTranslation.toLowerCase().includes(search.toLowerCase()) ||
      b.translation.toLowerCase().includes(search.toLowerCase()) ||
      String(b.verseId).includes(search)
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4a843] to-[#9c7a1f] flex items-center justify-center flex-shrink-0">
            <BookMarked size={18} className="text-[#0d1117]" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Bookmarks</h1>
        </div>
        <p className="text-sm text-muted ml-12">
          {count === 0
            ? "No bookmarks yet — hover an ayah and click the bookmark icon"
            : `${count} saved ayah${count !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Toolbar */}
      {count > 0 && (
        <div className="flex items-center gap-3 mb-6">
          {/* Search filter */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Filter by surah or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-default rounded-xl pl-9 pr-9 py-2.5 text-sm text-primary placeholder-[#636e7b] focus:outline-none focus:border-gold transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Clear all */}
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-default text-muted hover:text-red-400 hover:border-red-400/40 text-sm transition-all"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Sure?</span>
              <button
                onClick={() => {
                  clearAll();
                  setShowClearConfirm(false);
                }}
                className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-400/30 text-xs hover:bg-red-500/20 transition-colors"
              >
                Yes, clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-2 rounded-lg bg-tertiary text-muted text-xs hover:text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {count === 0 && (
        <div className="py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-card border border-active flex items-center justify-center mx-auto mb-5">
            <BookMarked size={36} className="text-[#30363d]" />
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">No bookmarks yet</h2>
          <p className="text-sm text-muted max-w-xs mx-auto mb-6">
            While reading a surah, hover over any ayah and click the{" "}
            <BookMarked size={13} className="inline text-gold" />{" "}
            bookmark icon to save it here.
          </p>
          <Link
            href="/surah/1"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-[#0d1117] rounded-xl text-sm font-semibold hover:bg-[#c49833] transition-colors"
          >
            Start Reading
          </Link>
        </div>
      )}

      {/* No results after filter */}
      {count > 0 && filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted text-sm">
            No bookmarks match &ldquo;{search}&rdquo;
          </p>
          <button
            onClick={() => setSearch("")}
            className="mt-3 text-gold text-xs hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Bookmark cards */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookmarkCard
              key={`${b.surahId}-${b.verseId}`}
              bookmark={b}
              onRemove={() =>
                toggleBookmark({
                  surahId: b.surahId,
                  surahName: b.surahName,
                  surahTranslation: b.surahTranslation,
                  verseId: b.verseId,
                  arabic: b.arabic,
                  translation: b.translation,
                  bangla: b.bangla,
                  banglaTranslations: b.banglaTranslations as any,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BookmarkCard({
  bookmark: b,
  onRemove,
}: {
  bookmark: BookmarkedAyah;
  onRemove: () => void;
}) {
  const { settings } = useFontSettings();
  const { isPlaying, loading, activeSegmentId, playContinuous, stop } = useAudioPlayer();
  const segmentId = `bookmark-${b.surahId}-${b.verseId}`;
  const isThisPlaying = activeSegmentId === segmentId && isPlaying;
  const isThisLoading = activeSegmentId === segmentId && loading;

  const handlePlay = () => {
    if (isThisPlaying) {
      stop();
    } else {
      const url = getAudioUrl(b.surahId, b.verseId);
      // playContinuous handles single-verse audio files just fine when passed a new ID
      // But actually playContinuous sets activeSegmentId to 'ALL'.
      // We should probably use a workaround or just use playContinuous and let it play to end.
      // Wait, we can use an inline audio play or just use playContinuous. But let's use the context method.
      playContinuous(url, 0, {
        surahId: b.surahId,
        surahName: b.surahName,
        ayahNumber: b.verseId,
        reciterName: "Mishary Rashid Alafasy",
      });
      // The context audio player will set activeSegmentId to 'ALL' for playContinuous.
      // We can instead add a custom property or just check metadata.
    }
  };

  const isMetadataMatch = useAudioPlayer().metadata?.surahId === b.surahId && useAudioPlayer().metadata?.ayahNumber === b.verseId;
  const currentlyPlaying = isPlaying && isMetadataMatch;
  const currentlyLoading = loading && isMetadataMatch;

  const finalHandlePlay = () => {
    if (currentlyPlaying) {
      stop();
    } else {
      const url = getAudioUrl(b.surahId, b.verseId);
      playContinuous(url, 0, {
        surahId: b.surahId,
        surahName: b.surahName,
        ayahNumber: b.verseId,
        reciterName: "Mishary Rashid Alafasy",
      });
    }
  };

  return (
    <div className={`group relative border rounded-2xl p-5 transition-all duration-200 ${
      currentlyPlaying ? "bg-[rgba(212,168,67,0.06)] border-[rgba(212,168,67,0.3)]" : "bg-card border-active hover:border-default hover:bg-[#1a1f27]"
    }`}>
      {/* Gold left accent */}
      <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-r ${currentlyPlaying ? 'bg-gold' : 'bg-gradient-to-b from-[#d4a843] to-[#9c7a1f] opacity-60'}`} />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3 pl-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gold bg-[rgba(212,168,67,0.12)] px-2.5 py-1 rounded-full">
            {b.surahName} • Ayah {b.verseId}
          </span>
          <span className="text-xs text-muted">{b.surahTranslation}</span>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <Clock size={10} />
            {timeAgo(b.savedAt)}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <button
            onClick={finalHandlePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentlyPlaying
                ? "bg-gold text-[#0d1117]"
                : "bg-tertiary text-secondary hover:text-primary hover:bg-hover"
            }`}
            title={currentlyPlaying ? "Stop" : "Play"}
          >
            {currentlyLoading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : currentlyPlaying ? (
              <Square size={13} fill="currentColor" />
            ) : (
              <Play size={13} fill="currentColor" />
            )}
            <span className="hidden sm:inline">{currentlyPlaying ? "Stop" : "Play"}</span>
          </button>
          <Link
            href={`/surah/${b.surahId}#ayah-${b.verseId}`}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-tertiary transition-colors ml-2"
            title="Go to ayah"
          >
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] transition-all"
            title="Remove bookmark"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <p
        className="text-right text-primary text-2xl mb-3 leading-[2] pl-3"
        style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}
      >
        {b.arabic}
      </p>

      {/* Divider */}
      <div className="border-t border-active mb-3" />

      {/* Translations */}
      {(settings.translationLanguage === "english" || settings.translationLanguage === "both") && (
        <div className="mb-4">
          <p className="text-[10px] text-muted mb-1.5 font-bold uppercase tracking-wider pl-3">English (Abdul Haleem)</p>
          <p
            className="text-primary/80 leading-relaxed pl-3"
            style={{ fontSize: `${settings.translationSize}px` }}
          >
            {b.translation}
          </p>
        </div>
      )}

      {(settings.translationLanguage === "bangla" || settings.translationLanguage === "both") && (
        <div className="space-y-4 pl-3">
          {b.banglaTranslations && b.banglaTranslations.length > 0 ? (
            b.banglaTranslations
              .filter(t => settings.selectedBanglaTranslators.includes(t.id))
              .map((t, idx) => (
                <div key={t.id} className={`${idx > 0 ? "pt-4 border-t border-active/50" : ""}`}>
                  <p className="text-[10px] text-gold mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                    {t.name}
                  </p>
                  <p
                    className="text-secondary leading-relaxed"
                    style={{ fontSize: `${settings.translationSize}px`, lineHeight: "1.8", fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {t.text}
                  </p>
                </div>
              ))
          ) : b.bangla ? (
            <div>
              <p className="text-[10px] text-gold mb-1.5 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                Bengali
              </p>
              <p
                className="text-secondary leading-relaxed"
                style={{ fontSize: `${settings.translationSize}px`, lineHeight: "1.8", fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {b.bangla}
              </p>
            </div>
          ) : (
            <p className="text-muted italic text-xs">
              বাংলা অনুবাদ পাওয়া যায়নি
            </p>
          )}
        </div>
      )}
    </div>
  );
}
