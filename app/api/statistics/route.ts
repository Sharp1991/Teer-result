import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type TeerResult = {
  date: string;
  firstRound: string;
  secondRound: string;
  location: string;
  status: string;
};

type NumberStat = {
  number: string;
  count: number;
};

type GapStat = {
  number: string;
  days: number;
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("teer_results")
      .select("result_date, first_round, second_round, location, status")
      .order("result_date", { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    const history: TeerResult[] = (data || []).map((row) => {
      const [year, month, day] = row.result_date.split("-");

      return {
        date: `${day}-${month}-${year}`,
        firstRound: row.first_round.padStart(2, "0"),
        secondRound: row.second_round.padStart(2, "0"),
        location: row.location?.trim() || "Shillong",
        status: row.status || "cached",
      };
    });

    if (!history.length) {
      return NextResponse.json({
        success: false,
        error: "No historical results available",
      });
    }

    const statistics = {
      firstRound: buildRoundStatistics(history, "firstRound"),
      secondRound: buildRoundStatistics(history, "secondRound"),
    };

    return NextResponse.json({
      success: true,
      statistics,
      scrapedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Statistics API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Statistics temporarily unavailable",
      },
      { status: 500 }
    );
  }
}

function buildRoundStatistics(
  history: TeerResult[],
  round: "firstRound" | "secondRound"
) {
  const values = history
    .map((result) => result[round])
    .filter((value) => /^\d{2}$/.test(value));

  return {
    hotNumbers: getHotNumbers(values, 60),
    dueNumbers: getDueNumbers(history, round),
    frequentNumbers: getGapNumbers(history, round, "short"),
    nonFrequentNumbers: getGapNumbers(history, round, "long"),
    yearlyHot: getHotNumbers(values, 365),
    yearlyCold: getColdNumbers(values, 365),
    allTimeHot: getHotNumbers(values, values.length),
    allTimeCold: getColdNumbers(values, values.length),
  };
}

function getHotNumbers(values: string[], limit: number): NumberStat[] {
  const selected = values.slice(0, limit);
  const counts = countNumbers(selected);

  return Object.entries(counts)
    .map(([number, count]) => ({ number, count }))
    .sort((a, b) => b.count - a.count || a.number.localeCompare(b.number))
    .slice(0, 10);
}

function getColdNumbers(values: string[], limit: number): NumberStat[] {
  const selected = values.slice(0, limit);
  const counts = countNumbers(selected);

  return Array.from({ length: 100 }, (_, i) => String(i).padStart(2, "0"))
    .map((number) => ({
      number,
      count: counts[number] || 0,
    }))
    .sort((a, b) => a.count - b.count || a.number.localeCompare(b.number))
    .slice(0, 10);
}

function countNumbers(values: string[]) {
  const counts: Record<string, number> = {};

  for (const value of values) {
    counts[value] = (counts[value] || 0) + 1;
  }

  return counts;
}

function getDueNumbers(
  history: TeerResult[],
  round: "firstRound" | "secondRound"
): GapStat[] {
  const results = history.filter((result) => /^\d{2}$/.test(result[round]));

  const lastSeen: Record<string, number> = {};

  results.forEach((result, index) => {
    const number = result[round];
    if (lastSeen[number] === undefined) {
      lastSeen[number] = index;
    }
  });

  return Array.from({ length: 100 }, (_, i) => String(i).padStart(2, "0"))
    .map((number) => ({
      number,
      days:
        lastSeen[number] === undefined
          ? results.length
          : lastSeen[number],
    }))
    .sort((a, b) => b.days - a.days || a.number.localeCompare(b.number))
    .slice(0, 10);
}

function getGapNumbers(
  history: TeerResult[],
  round: "firstRound" | "secondRound",
  direction: "short" | "long"
): GapStat[] {
  const results = history.filter((result) => /^\d{2}$/.test(result[round]));

  const appearances: Record<string, number[]> = {};

  results.forEach((result, index) => {
    const number = result[round];

    if (!appearances[number]) {
      appearances[number] = [];
    }

    appearances[number].push(index);
  });

  const stats: GapStat[] = [];

  for (let i = 0; i < 100; i++) {
    const number = String(i).padStart(2, "0");
    const positions = appearances[number] || [];

    if (positions.length < 2) {
      stats.push({
        number,
        days: positions.length === 1 ? results.length - 1 : results.length,
      });
      continue;
    }

    const gaps = [];

    for (let j = 1; j < positions.length; j++) {
      gaps.push(positions[j] - positions[j - 1]);
    }

    const averageGap =
      gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;

    stats.push({
      number,
      days: Math.round(averageGap),
    });
  }

  stats.sort((a, b) =>
    direction === "short"
      ? a.days - b.days || a.number.localeCompare(b.number)
      : b.days - a.days || a.number.localeCompare(b.number)
  );

  return stats.slice(0, 10);
}
