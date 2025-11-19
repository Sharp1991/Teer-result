import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET() {
  try {
    // Get all records for comprehensive statistics
    const { data: results, error } = await supabase
      .from('teer_results')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    // Calculate all statistics
    const statistics = calculateAllStatistics(results || []);

    return NextResponse.json({
      success: true,
      statistics,
      lastUpdated: new Date().toISOString(),
      totalRecords: results?.length || 0
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Could not generate statistics"
    }, { status: 500 });
  }
}

function calculateAllStatistics(results) {
  const last60Days = results.slice(0, 120); // Approx 60 days
  const last90Days = results.slice(0, 180); // Approx 90 days
  const allResults = results;

  return {
    hotNumbersLast60: calculateHotNumbers(last60Days),
    dueNumbers: calculateDueNumbers(allResults),
    numberRanges: calculateNumberRanges(last90Days)
  };
}

function calculateHotNumbers(results) {
  const frequency = {};
  
  results.forEach(result => {
    frequency[result.first_round] = (frequency[result.first_round] || 0) + 1;
    frequency[result.second_round] = (frequency[result.second_round] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([number, count]) => ({ 
      number: parseInt(number), 
      count 
    }));
}

function calculateDueNumbers(allResults) {
  const lastAppearance = {};
  
  // Track last appearance index for each number (0-99)
  allResults.forEach((result, index) => {
    lastAppearance[result.first_round] = index;
    lastAppearance[result.second_round] = index;
  });
  
  // Convert to "days since last appearance" (using index as proxy)
  const dueNumbers = [];
  for (let num = 0; num <= 99; num++) {
    if (lastAppearance[num] !== undefined) {
      dueNumbers.push({
        number: num,
        days: lastAppearance[num] + 1 // +1 to avoid 0 days
      });
    }
  }
  
  return dueNumbers
    .sort((a, b) => b.days - a.days)
    .slice(0, 10);
}

function calculateNumberRanges(results) {
  const ranges = [
    { name: "00-09", min: 0, max: 9, count: 0 },
    { name: "10-19", min: 10, max: 19, count: 0 },
    { name: "20-29", min: 20, max: 29, count: 0 },
    { name: "30-39", min: 30, max: 39, count: 0 },
    { name: "40-49", min: 40, max: 49, count: 0 },
    { name: "50-59", min: 50, max: 59, count: 0 },
    { name: "60-69", min: 60, max: 69, count: 0 },
    { name: "70-79", min: 70, max: 79, count: 0 },
    { name: "80-89", min: 80, max: 89, count: 0 },
    { name: "90-99", min: 90, max: 99, count: 0 }
  ];
  
  // Count numbers in each range
  results.forEach(result => {
    [result.first_round, result.second_round].forEach(num => {
      const range = ranges.find(r => num >= r.min && num <= r.max);
      if (range) range.count++;
    });
  });
  
  const totalNumbers = results.length * 2;
  
  return ranges
    .map(range => ({
      ...range,
      percentage: Math.round((range.count / totalNumbers) * 100)
    }))
    .filter(range => range.count > 0) // Only show ranges with data
    .sort((a, b) => b.percentage - a.percentage);
}
