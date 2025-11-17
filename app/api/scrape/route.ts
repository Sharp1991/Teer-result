// app/api/scrape/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const target = "https://teertooday.com/";

  let res;
  try {
    res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TeerScraper/1.0; +https://example.com)"
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch target site" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch target site", status: res.status }, { status: res.status });
  }

  const html = await res.text();

  // Extract date (DD-MM-YYYY)
  const dateMatch = html.match(/\b(\d{1,2}-\d{1,2}-\d{4})\b/);
  const date = dateMatch ? dateMatch[1] : null;

  // Extract location (SHILLONG)
  const locMatch = html.match(/\b(SHILLONG|Shillong|SHILLONG)\b/i);
  const location = locMatch ? locMatch[0].toUpperCase() : "SHILLONG";

  // Extract first two numbers near the date
  let first: string | null = null;
  let second: string | null = null;

  if (dateMatch) {
    const idx = dateMatch.index || 0;
    const look = html.slice(idx, idx + 400); // lookahead
    const numPair = look.match(/(\d{1,3})\D+(\d{1,3})/);
    if (numPair) {
      first = numPair[1];
      second = numPair[2];
    }
  }

  // Fallback: global search for two consecutive numbers
  if (!first || !second) {
    const globalPair = html.match(/(\d{1,3})\s+(\d{1,3})/);
    if (globalPair) {
      first = first || globalPair[1];
      second = second || globalPair[2];
    }
  }

  const payload = { date, location, first, second, source: target };

  return NextResponse.json(payload);
}
