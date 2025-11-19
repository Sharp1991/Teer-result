import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    // Get all records
    const { data: results, error } = await supabase
      .from('teer_results')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    // Calculate separate statistics for each round
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

// FIRST ROUND ONLY STATISTICS
function calculateFirstRoundStatistics(results) {
  const last60Days = results.slice(0, 120);
  
  // Use only first_round numbers
  const firstRoundNumbers = results.map(r => r.first_round);
  const last60FirstRound = last60Days.map(r => r.first_round);

  return {
    hotNumbers: calculateHotNumbers(last60FirstRound),
    dueNumbers: calculateDueNumbers(firstRoundNumbers, results),
    longestGaps: calculateLongestGaps(firstRoundNumbers, results),
    shortestGaps: calculateShortestGaps(firstRoundNumbers, results),
    highProbability: calculateHighProbability(firstRoundNumbers, results),
    lowProbability: calculateLowProbability(firstRoundNumbers, results),
    trendingUp: calculateTrendingUp(firstRoundNumbers, results),
    trendingDown: calculateTrendingDown(firstRoundNumbers, results)
  };
}

// SECOND ROUND ONLY STATISTICS  
function calculateSecondRoundStatistics(results) {
  const last60Days = results.slice(0, 120);
  
  // Use only second_round numbers
  const secondRoundNumbers = results.map(r => r.second_round);
  const last60SecondRound = last60Days.map(r => r.second_round);

  return {
    hotNumbers: calculateHotNumbers(last60SecondRound),
    dueNumbers: calculateDueNumbers(secondRoundNumbers, results),
    longestGaps: calculateLongestGaps(secondRoundNumbers, results),
    shortestGaps: calculateShortestGaps(secondRoundNumbers, results),
    highProbability: calculateHighProbability(secondRoundNumbers, results),
    lowProbability: calculateLowProbability(secondRoundNumbers, results),
    trendingUp: calculateTrendingUp(secondRoundNumbers, results),
    trendingDown: calculateTrendingDown(secondRoundNumbers, results)
  };
}

// Helper functions (now work with single round data)
function calculateHotNumbers(roundNumbers) {
  const frequency = {};
  
  roundNumbers.forEach(number => {
    frequency[number] = (frequency[number] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([number, count]) => ({ 
      number: parseInt(number), 
      count 
    }));
}

function calculateDueNumbers(roundNumbers, allResults) {
  const lastAppearance = {};
  
  allResults.forEach((result, index) => {
    const number = roundNumbers[index];
    if (number !== undefined) {
      lastAppearance[number] = index;
    }
  });
  
  const dueNumbers = [];
  for (let num = 0; num <= 99; num++) {
    if (lastAppearance[num] !== undefined) {
      dueNumbers.push({
        number: num,
        days: lastAppearance[num] + 1
      });
    }
  }
  
  return dueNumbers
    .sort((a, b) => b.days - a.days)
    .slice(0, 10);
}

// Add other calculation functions for gaps, probability, trends...
function calculateLongestGaps(roundNumbers, allResults) {
  // Calculate longest gaps for this specific round
  const gaps = calculateAllGaps(roundNumbers, allResults);
  return gaps.sort((a, b) => b.days - a.days).slice(0, 10);
}

function calculateShortestGaps(roundNumbers, allResults) {
  // Calculate shortest gaps for this specific round
  const gaps = calculateAllGaps(roundNumbers, allResults);
  return gaps.sort((a, b) => a.days - b.days).slice(0, 10);
}

function calculateAllGaps(roundNumbers, allResults) {
  const gaps = [];
  const appearances = {};
  
  // Track all appearance indices for each number
  allResults.forEach((result, index) => {
    const number = roundNumbers[index];
    if (number !== undefined) {
      if (!appearances[number]) appearances[number] = [];
      appearances[number].push(index);
    }
  });
  
  // Calculate gaps between appearances
  for (let num = 0; num <= 99; num++) {
    if (appearances[num] && appearances[num].length > 1) {
      const numGaps = [];
      for (let i = 1; i < appearances[num].length; i++) {
        numGaps.push(appearances[num][i] - appearances[num][i-1]);
      }
      const avgGap = numGaps.reduce((a, b) => a + b, 0) / numGaps.length;
      gaps.push({ number: num, days: Math.round(avgGap) });
    }
  }
  
  return gaps;
}

// Placeholder functions for other calculations
function calculateHighProbability(roundNumbers, allResults) {
  // Implementation for high probability numbers
  return Array.from({length: 10}, (_, i) => ({ 
    number: i * 10, 
    probability: 90 - (i * 5) 
  }));
}

function calculateLowProbability(roundNumbers, allResults) {
  // Implementation for low probability numbers  
  return Array.from({length: 10}, (_, i) => ({ 
    number: i * 5, 
    probability: 10 + (i * 3) 
  }));
}

function calculateTrendingUp(roundNumbers, allResults) {
  // Implementation for trending up numbers
  return Array.from({length: 10}, (_, i) => ({ 
    number: 50 + i, 
    trend: 5 + i 
  }));
}

function calculateTrendingDown(roundNumbers, allResults) {
  // Implementation for trending down numbers
  return Array.from({length: 10}, (_, i) => ({ 
    number: 10 + i, 
    trend: -5 - i 
  }));
}
