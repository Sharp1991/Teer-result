import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(request) {
  try {
    const { records } = await request.json();
    
    // Upload all records to Supabase
    const { data, error } = await supabase
      .from('teer_results')
      .upsert(records, { onConflict: 'date' });
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      message: `Uploaded ${records.length} records to Supabase`,
      inserted: data?.length || 0
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
