import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SOURCE_URL = "https://teertooday.com/Previous-Results.php";

type ScrapedResult = {
  result_date: string;
  first_round: string;
  second_round: string;
  location: string;
};

Deno.serve(async () => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const response = await fetch(SOURCE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Source website returned ${response.status}`);
    }

    const html = await response.text();

    const pattern =
      /(\d{1,2})-(\d{1,2})-(\d{4})<\/td>\s*<td[^>]*>(\d{1,2})<\/td>\s*<td[^>]*>(\d{1,2})<\/td>\s*<td[^>]*>([^<]+)/gi;

    const results: ScrapedResult[] = [];
    let match;

    while ((match = pattern.exec(html)) !== null) {
      const [, day, month, year, firstRound, secondRound, city] = match;

      results.push({
        result_date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        first_round: firstRound.padStart(2, "0"),
        second_round: secondRound.padStart(2, "0"),
        location: city.trim() || "Shillong",
      });
    }

    if (!results.length) {
      throw new Error("No results found on source website");
    }

    const { data: latestRow, error: latestError } = await supabase
      .from("teer_results")
      .select("result_date")
      .order("result_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestError) {
      throw new Error(`Supabase lookup error: ${latestError.message}`);
    }

    const latestStoredDate = latestRow?.result_date || "1900-01-01";

    const newResults = results.filter(
      (result) => result.result_date > latestStoredDate
    );

    if (newResults.length > 0) {
      const { error: insertError } = await supabase
        .from("teer_results")
        .upsert(
          newResults.map((result) => ({
            ...result,
            status: "cached",
          })),
          {
            onConflict: "result_date",
            ignoreDuplicates: true,
          }
        );

      if (insertError) {
        throw new Error(`Supabase insert error: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        scraped: results.length,
        newResults: newResults.length,
        alreadyPresent: results.length - newResults.length,
        insertedDates: newResults.map((result) => result.result_date),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Teer updater error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});
