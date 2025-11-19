import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET() {
  try {
    // Get last ~120 records (approx 60 days)
    const { data: results, error } = await supabase
      .from('teer_results')
      .select('*')
      .order('id', { ascending: false })
      .limit(120);

    if (error) throw error;

    // Calculate ONLY hot numbers for last 60 days
    const hotNumbers = calculateHotNumbers(results || []);

    return NextResponse.json({
      success: true,
      statistics: {
        hotNumbersLast60: hotNumbers
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Could not generate statistics"
    }, { status: 500 });
  }
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
