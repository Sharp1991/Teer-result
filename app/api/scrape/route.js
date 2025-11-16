import cheerio from "cheerio";

export async function GET() {
  const target = "https://teertooday.com/";
  const res = await fetch(target, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TeerScraper/1.0; +https://example.com)"
    }
  });

  if (!res.ok) {
    return new Response("Failed to fetch target site: " + res.status, { status: 502 });
  }

  const html = await res.text();

  // Try to extract date (DD-MM-YYYY) and the first pair of numbers after it.
  const dateMatch = html.match(/\b(\d{1,2}-\d{1,2}-\d{4})\b/);
  const date = dateMatch ? dateMatch[1] : null;

  // Try to find location (e.g., 'SHILLONG')
  const locMatch = html.match(/\b(SHILLONG|Shillong|SHILLONG)\b/i);
  const location = locMatch ? locMatch[0].toUpperCase() : "SHILLONG";

  // Search for two numbers (1-3 digits) near the date in the HTML.
  let first = null, second = null;
  if (dateMatch) {
    const idx = dateMatch.index;
    const look = html.slice(idx, idx + 400); // look ahead region
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
  return new Response(JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" }
  });
}