import { NextResponse } from "next/server";
import cheerio from "cheerio";

export async function GET() {
  try {
    const url = "https://teertooday.com/Previous-Results.php";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    const results = [];

    $("table tr").each((i, row) => {
      const cells = $(row).find("td");
      if (cells.length === 4) {
        const date = $(cells[0]).text().trim();
        const first = $(cells[1]).text().trim();
        const second = $(cells[2]).text().trim();
        const city = $(cells[3]).text().trim();

        if (date && first && second && city) {
          results.push({ date, first, second, location: city });
        }
      }
    });

    console.log("Scraped results:", results);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}
