import { NextResponse } from "next/server";
import { getAllSurahs } from "@/lib/quran";

export async function GET() {
  const surahs = getAllSurahs();
  return NextResponse.json(surahs);
}
