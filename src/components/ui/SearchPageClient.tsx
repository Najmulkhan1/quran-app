"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { SearchResult } from "@/lib/types";

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[rgba(212,168,67,0.25)] text-gold rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function SearchPageClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) return;
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

  // Debounced live search — triggers 300ms after the user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Search Quran</h1>
        <p className="text-sm text-muted">
          Search across all 114 surahs by Arabic or English text
        </p>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3 bg-card border border-default rounded-xl px-4 py-3 focus-within:border-gold transition-colors">
          {loading ? (
            <Loader2 size={18} className="text-gold animate-spin flex-shrink-0" />
          ) : (
            <Search size={18} className="text-muted flex-shrink-0" />
          )}
          <input
            autoFocus
            type="text"
            placeholder="Search by translation or Arabic text..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch(query)}
            className="flex-1 bg-transparent text-primary placeholder-[#636e7b] focus:outline-none text-sm"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setSearched(false);
              }}
              className="text-muted hover:text-primary transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => doSearch(query)}
          disabled={query.length < 2 || loading}
          className="mt-3 w-full py-2.5 bg-gold text-[#0d1117] rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-[#c49833] transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {!searched && !loading && (
        <div className="py-16 text-center">
          <Search size={48} className="mx-auto mb-4 text-[#30363d]" />
          <p className="text-muted text-sm">
            Enter a keyword to search across the Quran
          </p>
          <p className="text-muted text-xs mt-1">
            Try: &ldquo;mercy&rdquo;, &ldquo;prayer&rdquo;, &ldquo;paradise&rdquo;
          </p>
        </div>
      )}

      {searched && results.length === 0 && !loading && (
        <div className="py-16 text-center">
          <p className="text-muted text-sm">
            No results found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div className="text-xs text-muted mb-3">
            {count} result{count !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            {count > 50 && " (showing first 50)"}
          </div>
          <div className="space-y-3">
            {results.map((r, i) => (
              <Link
                key={i}
                href={`/surah/${r.surah_id}#ayah-${r.verse_number}`}
                className="block bg-card border border-active rounded-xl p-5 hover:border-default hover:bg-[#1a1f27] transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-gold bg-[rgba(212,168,67,0.1)] px-2.5 py-1 rounded-full">
                    {r.surah_name} • Ayah {r.verse_number}
                  </span>
                  <span className="text-xs text-muted">
                    {r.surah_translation}
                  </span>
                </div>
                <p
                  className="text-right text-primary text-xl mb-3 leading-relaxed"
                  style={{ fontFamily: "'Amiri', serif", direction: "rtl" }}
                >
                  {r.arabic}
                </p>
                <p className="text-sm text-secondary leading-relaxed">
                  {highlight(r.translation, query)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
