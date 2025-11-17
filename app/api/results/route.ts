// app/api/results/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const scrapeRes = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/scrape`,
      { cache: "no-store" }
    );
    const json = await scrapeRes.json();

    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
      return NextResponse.json({ error: "No results found", results: [] }, { status: 500 });
    }

    // Take the most recent (or first) row
    const latest = json.data[0];

    const result = {
      date: latest.date,
      firstRound: latest.first,
      secondRound: latest.second,
      location: latest.location,
      time: '',        // if no time on site, you can leave empty or hardcode
      source: "teertooday.com",
    };

    return NextResponse.json({
      success: true,
      results: [result],
      lastUpdated: new Date().toISOString(),
      source: "teertooday.com",
    });
  } catch (err) {
    console.error("Results API error:", err);
    return NextResponse.json({ error: "Failed to scrape", results: [] }, { status: 500 });
  }
}
