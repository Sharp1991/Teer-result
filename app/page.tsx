// app/page.tsx
import { Result } from "@/types"; // adjust if you have types

export default async function Home() {
  // Use the full URL directly for scraping
  const res = await fetch("https://teertooday.com/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TeerScraper/1.0; +https://example.com)"
    }
  });

  const html = await res.text();

  // Scrape numbers from HTML
  const dateMatch = html.match(/\b(\d{1,2}-\d{1,2}-\d{4})\b/);
  const date = dateMatch ? dateMatch[1] : null;

  let first = null, second = null;
  if (dateMatch) {
    const idx = dateMatch.index;
    const look = html.slice(idx, idx + 400);
    const numPair = look.match(/(\d{1,3})\D+(\d{1,3})/);
    if (numPair) {
      first = numPair[1];
      second = numPair[2];
    }
  }

  const todayResult: Result = { date, first, second, source: "https://teertooday.com/" };

  return (
    <main>
      <h1>Teer Result</h1>
      <p>Date: {todayResult.date}</p>
      <p>First: {todayResult.first}</p>
      <p>Second: {todayResult.second}</p>
    </main>
  );
}
