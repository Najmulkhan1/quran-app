"use client";
import { useAudio } from "@/context/AudioContext";

export function useAudioPlayer() {
  const audio = useAudio();
  return {
    isPlaying: audio.isPlaying,
    loading: audio.loading,
    currentTimeMs: audio.currentTimeMs,
    activeSegmentId: audio.activeSegmentId,
    playSegment: audio.playSegment,
    playContinuous: audio.playContinuous,
    stop: audio.stop,
    // New methods exposed for the bar
    togglePlayPause: audio.togglePlayPause,
    seek: audio.seek,
    skip: audio.skip,
    duration: audio.duration,
    metadata: audio.metadata
  };
}
