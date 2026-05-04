const fs = require("fs");
const https = require("https");
const path = require("path");

// Surah verse counts (official Quran data)
const surahVerseCounts = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6, 5, 6, 7, 5, 29, 10
];

// HTML entity decode helper
function cleanText(text) {
  return text
    .replace(/<sup[^>]*>.*?<\/sup>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

console.log("Fetching Bangla translation from quran.com API...");

https.get(
  "https://api.quran.com/api/v4/quran/translations/161?language=bn",
  {
    headers: {
      "Accept": "application/json",
      "User-Agent": "QuranApp/1.0",
    },
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        const translations = parsed.translations;

        console.log(`Total verses fetched: ${translations.length}`);

        const result = [];
        let globalIdx = 0;

        for (let surahIdx = 0; surahIdx < 114; surahIdx++) {
          const surahId = surahIdx + 1;
          const verseCount = surahVerseCounts[surahIdx];
          const verses = [];

          for (let verseIdx = 0; verseIdx < verseCount; verseIdx++) {
            const verseId = verseIdx + 1;
            const banglaText = translations[globalIdx]
              ? cleanText(translations[globalIdx].text)
              : "";

            verses.push({
              id: verseId,
              bangla: banglaText,
            });
            globalIdx++;
          }

          result.push({ id: surahId, verses });
        }

        const outputPath = path.join(
          __dirname,
          "../src/data/quran_bn.json"
        );
        fs.writeFileSync(outputPath, JSON.stringify(result));
        console.log(
          `✅ Successfully wrote quran_bn.json with ${globalIdx} total verses across 114 surahs`
        );

        // Verify
        console.log(`\nSample - Surah 1, Verse 1: ${result[0].verses[0].bangla}`);
        console.log(`Sample - Surah 2, Verse 255 (Ayatul Kursi): ${result[1].verses[254].bangla}`);
        console.log(`Sample - Surah 114, last verse: ${result[113].verses[result[113].verses.length - 1].bangla}`);
      } catch (err) {
        console.error("Error processing data:", err);
      }
    });
  }
).on("error", (err) => {
  console.error("Request failed:", err);
});
