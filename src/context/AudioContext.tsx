"use client";
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { AudioMetadata } from "@/lib/types";

interface AudioContextValue {
  isPlaying: boolean;
  loading: boolean;
  currentTimeMs: number;
  duration: number;
  activeSegmentId: string | null;
  metadata: AudioMetadata | null;
  playSegment: (id: string, url: string, startMs: number, endMs: number, meta: AudioMetadata) => void;
  playContinuous: (url: string, startMs: number, meta: AudioMetadata) => void;
  togglePlayPause: () => void;
  stop: () => void;
  seek: (timeMs: number) => void;
  skip: (seconds: number) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!audioRef.current) return;
    const currentMs = audioRef.current.currentTime * 1000;
    setCurrentTimeMs(currentMs);

    if (endTimeRef.current && currentMs >= endTimeRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setActiveSegmentId(null);
      endTimeRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(startTracking);
  }, []);

  const stopTracking = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const playSegment = useCallback((id: string, url: string, startMs: number, endMs: number, meta: AudioMetadata) => {
    if (activeSegmentId === id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      stopTracking();
      setActiveSegmentId(null);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (audioRef.current.src !== url) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
    }

    endTimeRef.current = endMs;
    setActiveSegmentId(id);
    setMetadata(meta);
    setLoading(true);

    audioRef.current.currentTime = startMs / 1000;
    setCurrentTimeMs(startMs);

    audioRef.current.play().then(() => {
      setLoading(false);
      setIsPlaying(true);
      startTracking();
    }).catch(err => {
      console.error("Audio play error:", err);
      setLoading(false);
      setIsPlaying(false);
      setActiveSegmentId(null);
    });

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setActiveSegmentId(null);
      stopTracking();
    };

    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current!.duration * 1000);
    };
  }, [activeSegmentId, isPlaying, startTracking, stopTracking]);

  const playContinuous = useCallback((url: string, startMs: number = 0, meta: AudioMetadata) => {
    if (activeSegmentId === "ALL" && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      stopTracking();
      setActiveSegmentId(null);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (audioRef.current.src !== url) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
    }

    endTimeRef.current = null;
    setActiveSegmentId("ALL");
    setMetadata(meta);
    setLoading(true);

    if (Math.abs(audioRef.current.currentTime * 1000 - startMs) > 200) {
      audioRef.current.currentTime = startMs / 1000;
    }

    audioRef.current.play().then(() => {
      setLoading(false);
      setIsPlaying(true);
      startTracking();
    }).catch(err => {
      console.error("Audio play error:", err);
      setLoading(false);
      setIsPlaying(false);
      setActiveSegmentId(null);
    });

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setActiveSegmentId(null);
      stopTracking();
    };

    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current!.duration * 1000);
    };
  }, [activeSegmentId, isPlaying, startTracking, stopTracking]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopTracking();
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        startTracking();
      });
    }
  }, [isPlaying, startTracking, stopTracking]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      stopTracking();
    }
    setIsPlaying(false);
    setActiveSegmentId(null);
    setMetadata(null);
  }, [stopTracking]);

  const seek = useCallback((timeMs: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeMs / 1000;
      setCurrentTimeMs(timeMs);
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTimeMs(newTime * 1000);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      stopTracking();
    };
  }, [stopTracking]);

  return (
    <AudioContext.Provider value={{
      isPlaying, loading, currentTimeMs, duration, activeSegmentId, metadata,
      playSegment, playContinuous, togglePlayPause, stop, seek, skip
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
}
