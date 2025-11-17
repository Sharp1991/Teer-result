import { NextResponse } from "next/server";
import cheerio from "cheerio";

export async function GET() {
  try {
    const target = "https://teertooday.com/";

    // Use the built-in fetch (no node-fetch needed)
    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TeerScraper/1.0; +https://example.com)"
      }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch target site: ${res.status}` },
        { status: 502 }
      );
    }

    const html = await res.text();

    // Load HTML with cheerio
    const $ = cheerio.load(html);

    // Example scraping logic:
    // Adjust selectors based on the website structure
    const dateMatch = html.match(/\b(\d{1,2}-\d{1,2}-\d{4})\b/);
    const date = dateMatch ? dateMatch[1] : null;

    let first: string | null = null;
    let second: string | null = null;

    if (dateMatch) {
      const idx = dateMatch.index || 0;
      const look = html.slice(idx, idx + 400);
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

    const payload = {
      date,
      location: "SHILLONG", // you can refine this scraping if needed
      first,
      second,
      source: target,
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Scraper error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
