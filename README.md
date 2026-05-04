# 🕌 Quran Mazid — Web Application

A full-featured Quran reading app built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** — cloned from [quranmazid.com](https://quranmazid.com).

---

## ✨ Features

| Feature | Description |
|---|---|
| 📖 Surah Reader | All 114 Surahs with Arabic text + English translation |
| 🔊 Audio Playback | Per-ayah recitation via Alafasy CDN |
| 🔍 Search | Search across all ayahs by English or Arabic |
| ⚙️ Font Settings | 3 Arabic fonts, adjustable sizes, persisted to localStorage |
| 📱 Responsive | Mobile drawer + desktop sidebar |
| 🌙 Dark Theme | GitHub-inspired dark UI |
| ⚡ SSG | All 114 surah pages pre-rendered at build time |

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Data**: Quran JSON (embedded)
- **Audio**: everyayah.com CDN (Alafasy 128kbps)
- **Fonts**: Amiri, Scheherazade New (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/quran-app.git
cd quran-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it will redirect to `/surah/1`.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── surahs/route.ts       → GET all 114 surahs
│   │   ├── surah/[id]/route.ts   → GET single surah with verses
│   │   └── search/route.ts       → GET search results
│   ├── surah/[id]/page.tsx       → SSG Surah Reader pages
│   ├── search/page.tsx           → Search page
│   └── layout.tsx                → Root layout
├── components/
│   ├── layout/
│   │   ├── IconSidebar.tsx       → Left icon sidebar
│   │   ├── SurahSidebar.tsx      → Scrollable surah list
│   │   └── MainLayout.tsx        → Full layout wrapper
│   ├── surah/
│   │   ├── SurahHeader.tsx       → Surah name + meta + play all
│   │   ├── AyahCard.tsx          → Individual verse card
│   │   └── SurahReader.tsx       → Reader with audio state
│   └── ui/
│       ├── FontSettingsPanel.tsx → Font selector + size sliders
│       ├── SearchBar.tsx         → Modal search overlay
│       └── SearchPageClient.tsx  → Full search page
├── hooks/
│   ├── useFontSettings.ts        → Font settings + localStorage
│   └── useAudioPlayer.ts         → Audio play/pause/stop
├── lib/
│   ├── quran.ts                  → Data helpers + audio URL
│   └── types.ts                  → TypeScript interfaces
└── data/
    ├── surahs.json               → 114 surah metadata
    └── quran_en.json             → Full Quran with translation
```

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/surahs` | GET | All 114 surahs metadata |
| `/api/surah/:id` | GET | Single surah with all verses |
| `/api/search?q=mercy` | GET | Search ayahs (min 2 chars) |

---

## 🎨 Font Settings

Accessible via the **Settings icon** in the top-right header:

- **Arabic Font**: Amiri / Scheherazade New / Uthmanic
- **Arabic Size**: 18px – 56px slider
- **Translation Size**: 12px – 24px slider
- All settings **persist** via `localStorage`

---

## 🔊 Audio

Uses the free **EveryAyah CDN**:
```
https://everyayah.com/data/Alafasy_128kbps/{surah}{ayah}.mp3
```

- Click **Play** on any ayah card (hover to reveal)
- Click **Play Full Surah** in the surah header
- Playing one ayah auto-stops the previous

---

## 📱 Responsive Behavior

| Screen | Layout |
|---|---|
| Desktop (≥768px) | Icon sidebar + Surah list sidebar + Content |
| Mobile (<768px) | Top header with hamburger → slide-in drawer |

---

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deploys.

---

## 📝 Notes

- Quran data is embedded as JSON (no external DB needed)
- All 114 surah pages are **statically generated** at build time
- Search works via API route with in-memory filtering
- Audio requires internet connection (external CDN)
