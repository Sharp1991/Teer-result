import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import cheerio from "cheerio";

const RESULTS_FILE = path.join(process.cwd(), "results.json");

export async function GET() {
  try {
    // Read cached results
    let results = [];
    if (fs.existsSync(RESULTS_FILE)) {
      results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf-8"));
    }

    // Get current time in IST
    const now = new Date();
    const istOffset = 5.5 * 60; // IST = UTC +5:30
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utc + istOffset * 60000);
    const hours = istTime.getHours();

    // Only scrape if time is between 17:00 and 18:00 IST
    if (hours === 17) {
      console.log("Scraping latest result (IST)...");

      const response = await fetch("https://teertooday.com/Previous-Results.php");
      const html = await response.text();
      const $ = cheerio.load(html);

      let latestResult = null;
      $("table tr").each((i, row) => {
        const cells = $(row).find("td");
        if (cells.length === 4) {
          const date = $(cells[0]).text().trim();
          const first = $(cells[1]).text().trim();
          const second = $(cells[2]).text().trim();
          const location = $(cells[3]).text().trim();

          if (date && first && second && location) {
            latestResult = { date, first, second, location };
            return false; // stop after first valid row
          }
        }
      });

      if (latestResult) {
        const todayIndex = results.findIndex(r => r.date === latestResult.date);
        if (todayIndex > -1) {
          results[todayIndex] = latestResult; // update existing
        } else {
          results.unshift(latestResult); // add new
          if (results.length > 7) results.pop(); // keep only last 7 days
        }
        fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      lastUpdated: new Date().toISOString(),
      source: "teertooday.com",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch results", data: [] }, { status: 500 });
  }
}
