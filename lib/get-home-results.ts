import { createClient } from '@supabase/supabase-js'

export interface HomeTeerResult {
  date: string
  firstRound: string
  secondRound: string
  location: string
  status: 'live' | 'cached'
}

export async function getHomeResults(): Promise<HomeTeerResult[]> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('teer_results')
    .select('result_date, first_round, second_round, location, status')
    .order('result_date', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Failed to fetch homepage Teer results:', error.message)
    return []
  }

  return (data ?? []).map((row) => {
    const [year, month, day] = row.result_date.split('-')

    return {
      date: `${day}-${month}-${year}`,
      firstRound: String(row.first_round).padStart(2, '0'),
      secondRound: String(row.second_round).padStart(2, '0'),
      location: row.location?.trim() || 'Shillong',
      status: (row.status || 'cached') as 'live' | 'cached',
    }
  })
}
