"use client";
import { useState, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { SearchResult } from "@/lib/types";

function highlight(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-[rgba(212,168,67,0.25)] text-[#d4a843] rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setCount(data.count || 0);
      setSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") doSearch(query);
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-[5vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4 animate-fade-in">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#30363d]">
            {loading ? (
              <Loader2 size={18} className="text-[#d4a843] animate-spin flex-shrink-0" />
            ) : (
              <Search size={18} className="text-[#636e7b] flex-shrink-0" />
            )}
            <input
              autoFocus
              type="text"
              placeholder="Search ayahs by English or Arabic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[#e6edf3] placeholder-[#636e7b] text-sm focus:outline-none"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setResults([]); setSearched(false); }}
                className="text-[#636e7b] hover:text-[#e6edf3] transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => doSearch(query)}
              disabled={query.length < 2}
              className="px-4 py-1.5 bg-[#d4a843] text-[#0d1117] rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-[#c49833] transition-colors"
            >
              Search
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!searched && !loading && (
              <div className="py-10 text-center text-[#636e7b] text-sm">
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                Type to search across all surahs
              </div>
            )}

            {searched && results.length === 0 && (
              <div className="py-10 text-center text-[#636e7b] text-sm">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}

            {results.length > 0 && (
              <>
                <div className="px-5 py-2 border-b border-[#21262d] text-xs text-[#636e7b]">
                  {count} result{count !== 1 ? "s" : ""} found
                  {count > 50 && " (showing first 50)"}
                </div>
                <ul>
                  {results.map((r, i) => (
                    <li key={i}>
                      <Link
                        href={`/surah/${r.surah_id}#ayah-${r.verse_number}`}
                        onClick={onClose}
                        className="block px-5 py-4 hover:bg-[#21262d] border-b border-[#1e2329] transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-[#d4a843] bg-[rgba(212,168,67,0.1)] px-2 py-0.5 rounded">
                            {r.surah_name} • {r.verse_number}
                          </span>
                          <span className="text-xs text-[#636e7b]">{r.surah_translation}</span>
                        </div>
                        <p
                          className="text-right text-[#e6edf3] text-lg mb-2 leading-relaxed"
                          style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}
                        >
                          {r.arabic}
                        </p>
                        <p className="text-sm text-[#848d97] leading-relaxed">
                          {highlight(r.translation, query)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-5 py-2 border-t border-[#30363d] flex items-center gap-4 text-[10px] text-[#636e7b]">
            <span><kbd className="bg-[#21262d] px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> to search</span>
            <span><kbd className="bg-[#21262d] px-1.5 py-0.5 rounded text-[10px]">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </>
  );
}
