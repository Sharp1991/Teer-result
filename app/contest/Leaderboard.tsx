'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-browser'

type Contestant = {
  contestant_id: number
  display_name: string
  contestant_type: string
  first_round_points: number
  second_round_points: number
  total_points: number
}

export default function Leaderboard() {
  const [rows, setRows] = useState<Contestant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLeaderboard() {
      const { data, error } = await supabase.rpc(
        'get_public_prediction_leaderboard'
      )

      if (error) {
        setError('Unable to load the leaderboard right now.')
      } else {
        setRows((data ?? []) as Contestant[])
      }

      setLoading(false)
    }

    loadLeaderboard()
  }, [])

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">Leaderboard</h2>
      <p className="mt-1 text-sm text-slate-500">
        Rankings are based on points earned from matching results.
      </p>

      {loading && (
        <p className="mt-4 text-sm text-slate-600">Loading leaderboard…</p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="mt-4 text-sm text-slate-600">
          No contestants yet. Be the first to join.
        </p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 pr-3">#</th>
                <th className="py-3 pr-3">Contestant</th>
                <th className="py-3 pr-3 text-right">First</th>
                <th className="py-3 pr-3 text-right">Second</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.contestant_id} className="border-b border-slate-100">
                  <td className="py-3 pr-3">{index + 1}</td>
                  <td className="py-3 pr-3 font-medium">
                    {row.display_name}
                    {row.contestant_type === 'bot' && (
                      <span className="ml-2 text-xs text-slate-500">BOT</span>
                    )}
                  </td>
                  <td className="py-3 pr-3 text-right">{row.first_round_points}</td>
                  <td className="py-3 pr-3 text-right">{row.second_round_points}</td>
                  <td className="py-3 text-right font-bold">{row.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
