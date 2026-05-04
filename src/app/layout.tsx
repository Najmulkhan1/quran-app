import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quran Mazid - Read & Listen to the Holy Quran",
  description:
    "Read the Holy Quran online with Arabic text, English translation, and audio recitation.",
  icons: { icon: "/favicon.ico" },
};

import { FontSettingsProvider } from "@/context/FontSettingsContext";
import { AudioProvider } from "@/context/AudioContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Scheherazade+New:wght@400;500;700&family=Noto+Sans+Bengali:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0d1117] text-[#e6edf3] antialiased">
        <FontSettingsProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </FontSettingsProvider>
      </body>
    </html>
  );
}
