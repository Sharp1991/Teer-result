export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Convert YYYY-MM-DD to the existing DD-MM-YYYY format
function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}

async function getAllResults() {
  const pageSize = 1000;
  const results: any[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("teer_results")
      .select("result_date, first_round, second_round, location, status")
      .order("result_date", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) break;

    results.push(
      ...data.map((row) => ({
        date: formatDate(row.result_date),
        firstRound: row.first_round.padStart(2, "0"),
        secondRound: row.second_round.padStart(2, "0"),
        location: row.location?.trim() || "Shillong",
        status: row.status || "cached",
      }))
    );

    if (data.length < pageSize) break;
  }

  return results;
}

export async function GET() {
  try {
    console.log("📦 Reading Teer results from Supabase...");

    const history = await getAllResults();
    const today = history[0] || null;

    const payload = {
      success: true,
      today,
      history,
      scrapedAt: new Date().toISOString(),
      note: "Data from Supabase",
    };

    return NextResponse.json(payload);

  } catch (err) {
    console.error("❌ Supabase Error:", err);

    return NextResponse.json({
      success: false,
      error: "Results temporarily unavailable",
      today: null,
      history: [],
      note: "Check back later",
    });
  }
}
