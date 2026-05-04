import { NextResponse } from "next/server";
import { searchQuran } from "@/lib/quran";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  const results = searchQuran(query);
  return NextResponse.json({ count: results.length, results });
}
