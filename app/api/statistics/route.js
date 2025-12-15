// /app/api/statistics/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for complex queries
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // 1️⃣ Hot Numbers — Last 60 Rounds
    const { data: hotNumbers } = await supabase.rpc('get_hot_numbers_60');

    // 2️⃣ Due Numbers — Longest Since Last Appearance
    const { data: dueNumbers } = await supabase.rpc('get_due_numbers');

    // 3️⃣ Frequent Numbers — Shortest Gap
    const { data: frequentNumbers } = await supabase.rpc('get_frequent_numbers');

    // 4️⃣ Non-Frequent Numbers — Longest Gap
    const { data: nonFrequentNumbers } = await supabase.rpc('get_non_frequent_numbers');

    // 5️⃣ Yearly Hot — Last 365 Rounds
    const { data: yearlyHot } = await supabase.rpc('get_yearly_hot');

    // 6️⃣ Yearly Cold — Last 365 Rounds
    const { data: yearlyCold } = await supabase.rpc('get_yearly_cold');

    // 7️⃣ All-Time Hot
    const { data: allTimeHot } = await supabase.rpc('get_all_time_hot');

    // 8️⃣ All-Time Cold
    const { data: allTimeCold } = await supabase.rpc('get_all_time_cold');

    // Return all stats in JSON
    return new Response(
      JSON.stringify({
        success: true,
        statistics: {
          firstRound: {
            hotNumbers,
            dueNumbers,
            frequentNumbers,
            nonFrequentNumbers,
            yearlyHot,
            yearlyCold,
            allTimeHot,
            allTimeCold,
          },
          secondRound: {
            hotNumbers,
            dueNumbers,
            frequentNumbers,
            nonFrequentNumbers,
            yearlyHot,
            yearlyCold,
            allTimeHot,
            allTimeCold,
          },
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
