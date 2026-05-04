"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import SurahHeader from "@/components/surah/SurahHeader";
import AyahCard from "@/components/surah/AyahCard";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useFontSettings } from "@/context/FontSettingsContext";
import { SurahWithVerses, AudioFileData, VerseWords } from "@/lib/types";

interface SurahReaderProps {
  surah: SurahWithVerses;
}

export default function SurahReader({ surah }: SurahReaderProps) {
  const { isPlaying, loading: audioLoading, currentTimeMs, activeSegmentId, playSegment, playContinuous, stop } = useAudioPlayer();
  const { settings } = useFontSettings();
  
  const [audioData, setAudioData] = useState<AudioFileData | null>(null);
  const [wordsData, setWordsData] = useState<Record<number, VerseWords>>({});
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch words and audio timing data
  useEffect(() => {
    let mounted = true;
    setDataLoading(true);

    const fetchData = async () => {
      try {
        // Fetch audio timings
        const audioRes = await fetch(`https://api.qurancdn.com/api/qdc/audio/reciters/7/audio_files?chapter=${surah.id}&segments=true`);
        const audioJson = await audioRes.json();
        
        // Fetch words data (paginated, but per_page=300 covers all surahs except Baqarah which might need 2 pages, but for simplicity we fetch 300)
        const wordsRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?words=true&word_fields=text_uthmani&per_page=300`);
        const wordsJson = await wordsRes.json();

        if (!mounted) return;

        if (audioJson.audio_files && audioJson.audio_files[0]) {
          setAudioData(audioJson.audio_files[0]);
        }

        if (wordsJson.verses) {
          const wordsMap: Record<number, VerseWords> = {};
          wordsJson.verses.forEach((v: any) => {
            wordsMap[v.verse_number] = v;
          });
          setWordsData(wordsMap);
        }
      } catch (error) {
        console.error("Failed to fetch surah advanced data", error);
      } finally {
        if (mounted) setDataLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [surah.id]);

  // Determine which ayah is currently active based on currentTimeMs
  let computedActiveAyahId: string | null = null;
  if (isPlaying || activeSegmentId) {
    if (activeSegmentId === "ALL" && audioData) {
      // Find which verse timing contains the currentTimeMs
      const activeTiming = audioData.verse_timings.find(
        t => currentTimeMs >= t.timestamp_from && currentTimeMs <= t.timestamp_to
      );
      if (activeTiming) {
        computedActiveAyahId = `${surah.id}-${activeTiming.verse_key.split(':')[1]}`;
      }
    } else {
      computedActiveAyahId = activeSegmentId;
    }
  }

  // Auto-scroll when active ayah changes during playAll
  const activeAyahRef = useRef<string | null>(null);
  useEffect(() => {
    if (activeSegmentId === "ALL" && computedActiveAyahId && computedActiveAyahId !== activeAyahRef.current) {
      activeAyahRef.current = computedActiveAyahId;
      const verseId = computedActiveAyahId.split('-')[1];
      const element = document.getElementById(`ayah-${verseId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (!computedActiveAyahId) {
      activeAyahRef.current = null;
    }
  }, [computedActiveAyahId, activeSegmentId]);

  const playAll = useCallback(() => {
    if (activeSegmentId === "ALL" && isPlaying) {
      stop();
      return;
    }
    if (audioData) {
      playContinuous(audioData.audio_url, audioData.verse_timings[0]?.timestamp_from || 0, {
        surahId: surah.id,
        surahName: surah.transliteration,
        reciterName: "Mishary Rashid Alafasy"
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isPlaying, activeSegmentId, audioData, playContinuous, stop]);

  return (
    <div className="animate-fade-in">
      <SurahHeader
        surah={surah}
        onPlayAll={playAll}
        isPlayingAll={activeSegmentId === "ALL" && isPlaying}
      />

      {/* Ayah cards */}
      <div className="space-y-0">
        {surah.verses.map((verse) => {
          const id = `${surah.id}-${verse.id}`;
          const isActive = computedActiveAyahId === id;
          const isAudioLoading = audioLoading && computedActiveAyahId === id;
          
          const verseTiming = audioData?.verse_timings.find(t => t.verse_key === `${surah.id}:${verse.id}`);
          const verseWords = wordsData[verse.id];

          return (
            <div key={verse.id} id={`ayah-${verse.id}`}>
              <AyahCard
                verse={verse}
                surahId={surah.id}
                arabicFont={settings.arabicFont}
                arabicSize={settings.arabicSize}
                translationSize={settings.translationSize}
                translationLanguage={settings.translationLanguage}
                selectedBanglaTranslators={settings.selectedBanglaTranslators}
                isPlaying={isActive}
                isLoading={isAudioLoading}
                verseTiming={verseTiming}
                verseWords={verseWords}
                currentTimeMs={isActive ? currentTimeMs : 0}
                onPlay={() => {
                  if (audioData && verseTiming) {
                    playSegment(id, audioData.audio_url, verseTiming.timestamp_from, verseTiming.timestamp_to, {
                      surahId: surah.id,
                      surahName: surah.transliteration,
                      ayahNumber: verse.id,
                      reciterName: "Mishary Rashid Alafasy"
                    });
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#21262d]">
        {surah.id > 1 ? (
          <a
            href={`/surah/${surah.id - 1}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border border-[#30363d] rounded-xl text-sm text-[#848d97] hover:text-[#e6edf3] hover:border-[#636e7b] transition-all"
          >
            ← Previous Surah
          </a>
        ) : (
          <div />
        )}

        <span className="text-xs text-[#636e7b]">
          Surah {surah.id} of 114
        </span>

        {surah.id < 114 ? (
          <a
            href={`/surah/${surah.id + 1}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border border-[#30363d] rounded-xl text-sm text-[#848d97] hover:text-[#e6edf3] hover:border-[#636e7b] transition-all"
          >
            Next Surah →
          </a>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
