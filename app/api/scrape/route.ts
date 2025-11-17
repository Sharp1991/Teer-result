import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const target = "https://teertooday.com/";
    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TeerScraper/1.0; +https://example.com)"
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch target site" }, { status: 502 });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Example scraping logic
    // Adjust selectors according to the site's HTML structure
    const dateMatch = html.match(/\b(\d{1,2}-\d{1,2}-\d{4})\b/);
    const date = dateMatch ? dateMatch[1] : null;

    const firstMatch = html.match(/(\d{1,3})\D+(\d{1,3})/);
    const first = firstMatch ? firstMatch[1] : null;
    const second = firstMatch ? firstMatch[2] : null;

    const payload = { date, first, second, source: target };

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json({ error: "Scraping failed", details: err }, { status: 500 });
  }
}
