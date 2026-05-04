const fs = require("fs");
const https = require("https");
const path = require("path");

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

function processVerses(flatVerses, isQuranCom) {
  const result = [];
  let globalIdx = 0;

  for (let surahIdx = 0; surahIdx < 114; surahIdx++) {
    const surahId = surahIdx + 1;
    const verseCount = surahVerseCounts[surahIdx];
    const verses = [];

    for (let verseIdx = 0; verseIdx < verseCount; verseIdx++) {
      const verseId = verseIdx + 1;
      let text = "";
      if (flatVerses[globalIdx]) {
        text = isQuranCom ? flatVerses[globalIdx].text : flatVerses[globalIdx].text;
      }
      verses.push({ id: verseId, bangla: cleanText(text || "") });
      globalIdx++;
    }
    result.push({ id: surahId, verses });
  }
  return result;
}

function fetchQuranCom(id, filename) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.quran.com/api/v4/quran/translations/${id}?language=bn`, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const result = processVerses(parsed.translations, true);
          fs.writeFileSync(path.join(__dirname, "../src/data", filename), JSON.stringify(result));
          console.log(`Saved ${filename}`);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function fetchFawazAhmed(id, filename) {
  return new Promise((resolve, reject) => {
    https.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${id}.json`, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const result = processVerses(parsed.quran, false);
          fs.writeFileSync(path.join(__dirname, "../src/data", filename), JSON.stringify(result));
          console.log(`Saved ${filename}`);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function run() {
  try {
    await fetchQuranCom(161, "bn_taisirul.json");
    await fetchQuranCom(163, "bn_mujibur.json");
    await fetchQuranCom(213, "bn_zakaria.json");
    await fetchFawazAhmed("ben-muhiuddinkhan", "bn_muhiuddin.json");
    console.log("All done!");
  } catch (e) {
    console.error(e);
  }
}

run();
