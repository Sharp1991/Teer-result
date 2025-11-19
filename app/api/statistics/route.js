import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// --------------------- MAIN GET ROUTE ---------------------
export async function GET() {
  try {
    const { data: results, error } = await supabase
      .from("teer_results")
      .select("*")
      .order("Date", { ascending: false });  // FIXED: sort by correct column name

    if (error) throw error;

    // Normalize date to JS Date object
    const normalizedResults = results.map(r => ({
      ...r,
      dateObj: new Date(r.Date) // FIXED: proper date
    }));

    const statistics = {
      firstRound: calculateFirstRoundStatistics(normalizedResults),
      secondRound: calculateSecondRoundStatistics(normalizedResults)
    };

    return NextResponse.json({
      success: true,
      statistics,
      lastUpdated: new Date().toISOString(),
      totalRecords: normalizedResults.length
    });

  } catch (error) {
    console.error("Statistics API error:", error);
    return NextResponse.json(
      { success: false, error: "Could not generate statistics" },
      { status: 500 }
    );
  }
}

// ---------------- FIRST ROUND STATS ----------------
function calculateFirstRoundStatistics(results) {
  const last60 = results.slice(0, 60);
  const last365 = results.slice(0, 365);

  return {
    hotNumbers: calculateFrequency(last60.map(r => r.first_round)),
    dueNumbers: calculateDueNumbers(results, "first_round"),
    frequentNumbers: calculateFrequentNumbers(results, "first_round"),
    nonFrequentNumbers: calculateNonFrequentNumbers(results, "first_round"),
    yearlyHot: calculateFrequency(last365.map(r => r.first_round)),
    yearlyCold: calculateColdNumbers(last365.map(r => r.first_round)),
    allTimeHot: calculateFrequency(results.map(r => r.first_round)),
    allTimeCold: calculateColdNumbers(results.map(r => r.first_round))
  };
}

// ---------------- SECOND ROUND STATS ----------------
function calculateSecondRoundStatistics(results) {
  const last60 = results.slice(0, 60);
  const last365 = results.slice(0, 365);

  return {
    hotNumbers: calculateFrequency(last60.map(r => r.second_round)),
    dueNumbers: calculateDueNumbers(results, "second_round"),
    frequentNumbers: calculateFrequentNumbers(results, "second_round"),
    nonFrequentNumbers: calculateNonFrequentNumbers(results, "second_round"),
    yearlyHot: calculateFrequency(last365.map(r => r.second_round)),
    yearlyCold: calculateColdNumbers(last365.map(r => r.second_round)),
    allTimeHot: calculateFrequency(results.map(r => r.second_round)),
    allTimeCold: calculateColdNumbers(results.map(r => r.second_round))
  };
}

// ---------------- FREQUENCY (HOT) ----------------
function calculateFrequency(numbers, limit = 10) {
  const freq = {};
  numbers.forEach(n => { freq[n] = (freq[n] || 0) + 1; });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([number, count]) => ({ number: parseInt(number), count }));
}

// ---------------- DUE NUMBERS ----------------
function calculateDueNumbers(results, field) {
  const lastSeen = {};
  const today = new Date();

  results.forEach(r => {
    const num = r[field];
    const d = r.dateObj;

    if (!lastSeen[num] || d > lastSeen[num]) {
      lastSeen[num] = d;
    }
  });

  const arr = [];
  for (let n = 0; n <= 99; n++) {
    const days = lastSeen[n]
      ? Math.floor((today - lastSeen[n]) / (1000 * 60 * 60 * 24))
      : 999;

    arr.push({ number: n, days });
  }

  return arr.sort((a, b) => b.days - a.days).slice(0, 10);
}

// ---------------- GAP CALCULATIONS ----------------
function calculateFrequentNumbers(results, field) {
  return calculateGaps(results, field)
    .filter(g => g.days < 999)
    .sort((a, b) => a.days - b.days)
    .slice(0, 10);
}

function calculateNonFrequentNumbers(results, field) {
  return calculateGaps(results, field)
    .filter(g => g.days < 999)
    .sort((a, b) => b.days - a.days)
    .slice(0, 10);
}

// ---------------- GAPS ----------------
function calculateGaps(results, field) {
  const map = {};

  const sorted = [...results].sort((a, b) => a.dateObj - b.dateObj);

  sorted.forEach(r => {
    const num = r[field];
    const d = r.dateObj;
    if (!map[num]) map[num] = [];
    map[num].push(d);
  });

  const output = [];
  for (let n = 0; n <= 99; n++) {
    const dates = map[n];
    if (!dates || dates.length < 2) {
      output.push({ number: n, days: 999 });
      continue;
    }

    const gaps = [];
    for (let i = 1; i < dates.length; i++) {
      const g = Math.floor((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
      gaps.push(g);
    }

    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    output.push({ number: n, days: Math.round(avg) });
  }
  return output;
}

// ---------------- COLD (LOW FREQUENCY) ----------------
function calculateColdNumbers(numbers, limit = 10) {
  const freq = {};
  numbers.forEach(n => { freq[n] = (freq[n] || 0) + 1; });

  const list = [];
  for (let n = 0; n <= 99; n++) {
    list.push({ number: n, count: freq[n] || 0 });
  }

  return list.sort((a, b) => a.count - b.count).slice(0, limit);
}
