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
  attempts: number
  hits: number
  accuracy: number
}

type Period = 'all' | '7' | '30'

function startDateFor(period: Period): string | null {
  if (period === 'all') return null
  const date = new Date()
  date.setDate(date.getDate() - (Number(period) - 1))
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export default function Leaderboard() {
  const [rows, setRows] = useState<Contestant[]>([])
  const [period, setPeriod] = useState<Period>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [botNumbers, setBotNumbers] = useState<{ first: string; second: string } | null>(null)
  const [botError, setBotError] = useState('')

  useEffect(() => {
    let active = true

    async function loadLeaderboard() {
      setLoading(true)
      setError('')

      const { data, error: rpcError } = await supabase.rpc(
        'get_public_prediction_leaderboard',
        { p_start_date: startDateFor(period) }
      )

      if (!active) return

      if (rpcError) {
        console.error('Leaderboard RPC error:', rpcError)
        setError('Unable to load the leaderboard right now.')
        setRows([])
      } else {
        setRows((data ?? []) as Contestant[])
      }

      setLoading(false)
    }

    loadLeaderboard()

    return () => {
      active = false
    }
  }, [period])

  useEffect(() => {
    let active = true

    async function loadTodayBotPrediction() {
      setBotError('')
      setBotNumbers(null)

      const today = new Date()
      const date = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
      ].join('-')

      const { data: contestants, error: contestantError } = await supabase
        .from('prediction_contestants')
        .select('id')
        .eq('display_name', 'Random Bot')
        .limit(1)

      if (!active) return
      if (contestantError || !contestants?.length) {
        console.error('Random Bot lookup error:', contestantError)
        setBotError('Today’s Random Bot predictions are unavailable.')
        return
      }

      const { data, error: predictionError } = await supabase
        .from('teer_predictions')
        .select('first_1,first_2,first_3,first_4,first_5,first_6,first_7,first_8,first_9,first_10,second_1,second_2,second_3,second_4,second_5,second_6,second_7,second_8,second_9,second_10')
        .eq('contestant_id', contestants[0].id)
        .eq('prediction_date', date)
        .maybeSingle()

      if (!active) return
      if (predictionError || !data) {
        console.error('Random Bot prediction query error:', predictionError)
        setBotError('Today’s Random Bot predictions are unavailable.')
        return
      }

      const first = Array.from({ length: 10 }, (_, i) =>
        data[`first_${i + 1}` as keyof typeof data]
      ).filter((value) => value != null && String(value).trim() !== '')

      const second = Array.from({ length: 10 }, (_, i) =>
        data[`second_${i + 1}` as keyof typeof data]
      ).filter((value) => value != null && String(value).trim() !== '')

      setBotNumbers({
        first: first.length ? first.join(', ') : '—',
        second: second.length ? second.join(', ') : '—',
      })
    }

    loadTodayBotPrediction()
    return () => { active = false }
  }, [])

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Rankings are based on points earned from matching results.
        </p>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Leaderboard period">
          {([
            ['all', 'All time'],
            ['7', 'Last 7 days'],
            ['30', 'Last 30 days'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              aria-pressed={period === value}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                period === value
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && <p className="mt-4 text-sm text-slate-600">Loading leaderboard…</p>}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="mt-4 text-sm text-slate-600">No contestants yet. Be the first to join.</p>
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
                  <th className="py-3 pr-3 text-right">Total</th>
                  <th className="py-3 pr-3 text-right">Attempts</th>
                  <th className="py-3 pr-3 text-right">Hits</th>
                  <th className="py-3 text-right">Accuracy</th>
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
                    <td className="py-3 pr-3 text-right font-bold">{row.total_points}</td>
                    <td className="py-3 pr-3 text-right">{row.attempts}</td>
                    <td className="py-3 pr-3 text-right">{row.hits}</td>
                    <td className="py-3 text-right">{row.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Today’s Random Bot Predictions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Predictions for both Shillong Teer rounds today.
        </p>

        {botError && <p className="mt-4 text-sm text-slate-600">{botError}</p>}
        {!botError && !botNumbers && (
          <p className="mt-4 text-sm text-slate-600">Loading today’s predictions…</p>
        )}
        {botNumbers && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">First Round</p>
              <p className="mt-1 text-2xl font-bold">{botNumbers.first}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Second Round</p>
              <p className="mt-1 text-2xl font-bold">{botNumbers.second}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
