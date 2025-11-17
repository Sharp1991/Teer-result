// app/api/scrape/route.ts

import { NextResponse } from "next/server";
import cheerio from "cheerio";

export async function GET() {
  try {
    const url = "https://teertooday.com/Previous-Results.php";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Now use Cheerio to find the table rows or the part of the HTML that contains the data
    // Inspect the HTML structure of the page and adapt these selectors accordingly.

    // Example: Let's assume the data is in a table, each row <tr>
    // and the cells are: Date, F/R, S/R, City in that order.

    const results: {
      date: string;
      first: string;
      second: string;
      location: string;
    }[] = [];

    $("table tr").each((i, row) => {
      const cells = $(row).find("td");
      if (cells.length === 4) {
        const date = $(cells[0]).text().trim();
        const first = $(cells[1]).text().trim();      // F/R
        const second = $(cells[2]).text().trim();     // S/R
        const city = $(cells[3]).text().trim();

        // Basic validation: only push if there's actually valid data
        if (date && first && second && city) {
          results.push({ date, first, second, location: city });
        }
      }
    });

    console.log("Scraped results:", results);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
