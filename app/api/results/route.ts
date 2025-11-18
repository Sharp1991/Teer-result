export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

// Convert to IST
function getIST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 5.5 * 3600 * 1000);
}

function getISTDateString() {
  return getIST().toLocaleDateString("en-IN").replace(/\//g, "-");
}

export async function GET() {
  try {
    console.log("🔄 Scraping fresh Teer results...");

    const html = await fetchHTML();
    const { today, history } = extractResults(html);

    const payload = {
      success: true,
      today,
      history: history.slice(0, 7),
      scrapedAt: new Date().toISOString(),
      note: "Live data from teertooday.com"
    };

    return NextResponse.json(payload);

  } catch (err) {
    console.error("❌ Scrape Error:", err);
    
    // Return friendly error with fallback data
    return NextResponse.json({
      success: false,
      error: "Live results temporarily unavailable",
      today: {
        date: getISTDateString(),
        firstRound: "00",
        secondRound: "00", 
        location: "Shillong",
        status: "cached"
      },
      history: [],
      note: "Check back later for live updates"
    });
  }
}

// Fetch raw HTML
async function fetchHTML() {
  const target = "https://teertooday.com/Previous-Results.php";

  const res = await fetch(target, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`Website returned ${res.status}`);
  return await res.text();
}

// More flexible regex
function extractResults(html: string) {
  const pattern =
    /(\d{1,2}-\d{1,2}-\d{4})<\/td>\s*<td[^>]*>(\d{1,2})<\/td>\s*<td[^>]*>(\d{1,2})<\/td>\s*<td[^>]*>([^<]+)/gi;

  const results: any[] = [];
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const [_, date, firstRound, secondRound, city] = match;
    results.push({
      date,
      firstRound: firstRound.padStart(2, '0'), // Ensure 2-digit format
      secondRound: secondRound.padStart(2, '0'),
      location: city.trim(),
      status: "cached",
    });
  }

  return {
    today: results[0] || null,
    history: results,
  };
}
