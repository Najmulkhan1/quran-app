import { NextResponse } from "next/server";
import { getSurahById } from "@/lib/quran";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const surahId = parseInt(id);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return NextResponse.json({ error: "Invalid surah number" }, { status: 400 });
  }

  const surah = getSurahById(surahId);
  if (!surah) {
    return NextResponse.json({ error: "Surah not found" }, { status: 404 });
  }

  return NextResponse.json(surah);
}
