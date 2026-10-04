import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

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
    const html = await fetchHTML();
    const { history } = extractResults(html);

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

async function fetchHTML() {
  const target = "https://teertooday.com/Previous-Results.php";

  const res = await fetch(target, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Website returned ${res.status}`);
  }

  return res.text();
}

function extractResults(html: string) {
  const pattern =
    /(\d{1,2}-\d{1,2}-\d{4})<\/td>\s*<td[^>]*>(\d{1,2})<\/td>\s*<td[^>]*>(\d{1,2})<\/td>\s*<td[^>]*>([^<]+)/gi;

  const results: TeerResult[] = [];
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const [, date, firstRound, secondRound, city] = match;

    results.push({
      date,
      firstRound: firstRound.padStart(2, "0"),
      secondRound: secondRound.padStart(2, "0"),
      location: city.trim(),
      status: "cached",
    });
  }

  return {
    history: results,
  };
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
