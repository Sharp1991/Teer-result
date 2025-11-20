import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data: results, error } = await supabase
      .from('teer_results')
      .select('*')
      .order('Date', { ascending: false }); // Use capital D

    if (error) throw error;

    const statistics = {
      firstRound: calculateFirstRoundStatistics(results || []),
      secondRound: calculateSecondRoundStatistics(results || [])
    };

    return NextResponse.json({
      success: true,
      statistics,
      lastUpdated: new Date().toISOString(),
      totalRecords: results?.length || 0
    });

  } catch (error) {
    console.error('Statistics API error:', error);
    return NextResponse.json({
      success: false,
      error: "Could not generate statistics"
    }, { status: 500 });
  }
}

// ------------------ STATISTICS ------------------

// FIRST ROUND
function calculateFirstRoundStatistics(results) {
  const last60Rounds = results.slice(0, 60);
  const last365Rounds = results.slice(0, 365);

  const firstRoundNumbers = results.map(r => r.first_round);
  const last60FirstRound = last60Rounds.map(r => r.first_round);
  const last365FirstRound = last365Rounds.map(r => r.first_round);

  return {
    hotNumbers: calculateFrequency(last60FirstRound, 10),
    dueNumbers: calculateDueNumbers(firstRoundNumbers, results, 'first_round'),
    frequentNumbers: calculateFrequentNumbers(firstRoundNumbers, results, 'first_round'),
    nonFrequentNumbers: calculateNonFrequentNumbers(firstRoundNumbers, results, 'first_round'),
    yearlyHot: calculateFrequency(last365FirstRound, 10),
    yearlyCold: calculateColdNumbers(last365FirstRound, 10),
    allTimeHot: calculateFrequency(firstRoundNumbers, 10),
    allTimeCold: calculateColdNumbers(firstRoundNumbers, 10)
  };
}

// SECOND ROUND
function calculateSecondRoundStatistics(results) {
  const last60Rounds = results.slice(0, 60);
  const last365Rounds = results.slice(0, 365);

  const secondRoundNumbers = results.map(r => r.second_round);
  const last60SecondRound = last60Rounds.map(r => r.second_round);
  const last365SecondRound = last365Rounds.map(r => r.second_round);

  return {
    hotNumbers: calculateFrequency(last60SecondRound, 10),
    dueNumbers: calculateDueNumbers(secondRoundNumbers, results, 'second_round'),
    frequentNumbers: calculateFrequentNumbers(secondRoundNumbers, results, 'second_round'),
    nonFrequentNumbers: calculateNonFrequentNumbers(secondRoundNumbers, results, 'second_round'),
    yearlyHot: calculateFrequency(last365SecondRound, 10),
    yearlyCold: calculateColdNumbers(last365SecondRound, 10),
    allTimeHot: calculateFrequency(secondRoundNumbers, 10),
    allTimeCold: calculateColdNumbers(secondRoundNumbers, 10)
  };
}

// ------------------ HELPERS ------------------

// Hot numbers
function calculateFrequency(roundNumbers, limit = 10) {
  const frequency = {};
  roundNumbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([number, count]) => ({ number: parseInt(number), count }));
}

// Due numbers (longest since last appearance)
function calculateDueNumbers(roundNumbers, allResults, roundType) {
  const lastAppearance = {};
  const today = new Date();

  allResults.forEach(result => {
    const number = result[roundType];
    const resultDate = new Date(result.Date); // Use capital D
    if (!lastAppearance[number] || resultDate > lastAppearance[number]) {
      lastAppearance[number] = resultDate;
    }
  });

  const dueNumbers = [];
  for (let num = 0; num <= 99; num++) {
    const daysSince = lastAppearance[num]
      ? Math.floor((today - lastAppearance[num]) / (1000 * 60 * 60 * 24))
      : 999;

    dueNumbers.push({ number: num, days: daysSince });
  }

  return dueNumbers.sort((a, b) => b.days - a.days).slice(0, 10);
}

// Frequent numbers (shortest average gap)
function calculateFrequentNumbers(roundNumbers, allResults, roundType) {
  const gaps = calculateAllGaps(allResults, roundType);
  return gaps.filter(g => g.days > 0 && g.days < 999).sort((a, b) => a.days - b.days).slice(0, 10);
}

// Non-frequent numbers (longest average gap)
function calculateNonFrequentNumbers(roundNumbers, allResults, roundType) {
  const gaps = calculateAllGaps(allResults, roundType);
  return gaps.filter(g => g.days > 0 && g.days < 999).sort((a, b) => b.days - a.days).slice(0, 10);
}

// Cold numbers
function calculateColdNumbers(roundNumbers, limit = 10) {
  const frequency = {};
  roundNumbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });

  const allNumbers = [];
  for (let num = 0; num <= 99; num++) {
    allNumbers.push({ number: num, count: frequency[num] || 0 });
  }

  return allNumbers.sort((a, b) => a.count - b.count).slice(0, limit);
}

// Calculate all gaps
function calculateAllGaps(allResults, roundType) {
  const appearances = {};
  const sorted = [...allResults].sort((a, b) => new Date(a.Date) - new Date(b.Date)); // Capital D

  sorted.forEach(result => {
    const number = result[roundType];
    const date = new Date(result.Date);
    if (!appearances[number]) appearances[number] = [];
    appearances[number].push(date);
  });

  const gaps = [];
  for (let num = 0; num <= 99; num++) {
    if (appearances[num] && appearances[num].length > 1) {
      const gapDays = [];
      for (let i = 1; i < appearances[num].length; i++) {
        gapDays.push(Math.floor((appearances[num][i] - appearances[num][i - 1]) / (1000 * 60 * 60 * 24)));
      }
      const avgGap = gapDays.reduce((a, b) => a + b, 0) / gapDays.length;
      gaps.push({ number: num, days: Math.round(avgGap) });
    } else {
      gaps.push({ number: num, days: 999 });
    }
  }

  return gaps;
}
