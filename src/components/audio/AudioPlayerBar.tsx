"use client";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Play, Pause, RotateCcw, RotateCw, X, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AudioPlayerBar() {
  const { 
    isPlaying, 
    currentTimeMs, 
    duration, 
    metadata, 
    togglePlayPause, 
    stop, 
    seek, 
    skip,
    loading
  } = useAudioPlayer();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !metadata) return null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTimeMs / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seek((val / 100) * duration);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-tertiary cursor-pointer group">
          <div 
            className="absolute top-0 left-0 h-full bg-gold transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-tertiary flex items-center justify-center flex-shrink-0 text-gold font-bold">
              {metadata.surahId}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-primary truncate">
                {metadata.surahName} {metadata.ayahNumber && ` - Ayah ${metadata.ayahNumber}`}
              </h4>
              <p className="text-[11px] text-secondary truncate">
                {metadata.reciterName}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-1 sm:gap-4">
              <button 
                onClick={() => skip(-10)}
                className="p-2 text-secondary hover:text-primary transition-colors"
                title="Back 10s"
              >
                <RotateCcw size={18} />
              </button>

              <button 
                onClick={togglePlayPause}
                disabled={loading}
                className="w-10 h-10 rounded-full bg-gold text-[#0d1117] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0d1117] border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <button 
                onClick={() => skip(10)}
                className="p-2 text-secondary hover:text-primary transition-colors"
                title="Forward 10s"
              >
                <RotateCw size={18} />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-muted min-w-[80px]">
              <span>{formatTime(currentTimeMs)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Extra Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:p-2 text-muted hover:text-primary transition-colors">
              <Volume2 size={18} />
            </button>
            <button 
              onClick={stop}
              className="p-2 text-muted hover:text-red-400 transition-colors"
              title="Close Player"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
