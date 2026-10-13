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
        setBotError('Rambo’s predictions are unavailable today.')
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
        setBotError('Rambo’s predictions are unavailable today.')
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

  const botRows = rows.filter((row) => row.contestant_type === "bot")

  return (
    <section className="mt-6 space-y-6 sm:mt-8">

      <section className="relative overflow-hidden rounded-3xl border border-lime-300/25 bg-gradient-to-br from-[#172a27] via-[#111d25] to-[#111827] p-5 shadow-xl sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-lime-300/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-lime-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />
                Bot battle arena
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                COMPARE YOUR <span className="text-lime-300">PICKS.</span>
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Meet the bots, check their track records, and see if your numbers can beat the machine.
              </p>
            </div>
            <a href="/contest/predict" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-lime-200">
              MAKE YOUR PICKS <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              {botRows.length} {botRows.length === 1 ? "BOT" : "BOTS"} · PERFORMANCE
            </p>
            <p className="text-xs text-slate-500">Swipe to explore →</p>
          </div>

          <div className="-mx-5 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-7 sm:px-7">
            {botRows.length > 0 ? botRows.map((bot, index) => {
              const isRambo = bot.display_name === "Random Bot"
              return (
                <article key={bot.contestant_id} className="group relative min-w-[270px] max-w-[340px] flex-1 snap-start overflow-hidden rounded-2xl border border-white/10 bg-[#0b1320]/90 p-5 transition duration-300 hover:-translate-y-1 hover:border-lime-300/40 sm:min-w-[300px]">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-lime-300/[0.06] blur-2xl transition group-hover:bg-lime-300/15" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 animate-bounce items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-3xl" style={{ animationDuration: "2.8s" }} aria-hidden="true">
                        🤖
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.16em] text-lime-300">
                          {isRambo ? "Your main rival" : `Bot rival #${index + 1}`}
                        </span>
                        <h3 className="mt-1 text-xl font-black text-white">
                          {isRambo ? "RAMBO" : bot.display_name}
                          <span className="text-lime-300">.</span>
                        </h3>
                        <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-400">
                          {isRambo
                            ? "Rambo is an automated prediction bot that generates random numbers every day for both the First Round and Second Round of Shillong Teer. Its predictions are random, letting you compare your own picks against numbers generated by chance."
                            : "Compare your predictions with this bot’s performance and track record."}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      BOT
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Points</p>
                      <p className="mt-1 text-xl font-black tabular-nums text-lime-300">{bot.total_points}</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Hits</p>
                      <p className="mt-1 text-xl font-black tabular-nums text-white">{bot.hits}<span className="text-xs font-medium text-slate-500">/{bot.attempts}</span></p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Accuracy</p>
                      <p className="mt-1 text-xl font-black tabular-nums text-white">{bot.accuracy}%</p>
                    </div>
                  </div>

                  {isRambo && (
                    <div className="mt-4 rounded-xl border border-lime-300/15 bg-lime-300/[0.04] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-lime-300">Today's numbers</p>
                        <span className="text-[9px] text-slate-500">FR / SR</span>
                      </div>
                      {botError ? (
                        <p className="mt-2 text-xs leading-5 text-slate-400">{botError}</p>
                      ) : botNumbers ? (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[9px] font-bold uppercase text-slate-500">First round</p>
                            <p className="mt-1 break-words text-sm font-extrabold leading-6 text-white">{botNumbers.first}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase text-slate-500">Second round</p>
                            <p className="mt-1 break-words text-sm font-extrabold leading-6 text-white">{botNumbers.second}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 animate-pulse text-xs text-slate-400">Rambo is checking its numbers…</p>
                      )}
                    </div>
                  )}

                  <a href="/contest/predict" className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-black text-white transition hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-300">
                    {isRambo ? "CHALLENGE RAMBO" : `CHALLENGE ${bot.display_name.toUpperCase()}`} <span aria-hidden="true">→</span>
                  </a>
                </article>
              )
            }) : (
              <article className="min-w-full snap-start rounded-2xl border border-white/10 bg-[#0b1320]/90 p-5 sm:min-w-[300px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 animate-bounce items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-3xl" style={{ animationDuration: "2.8s" }} aria-hidden="true">🤖</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-lime-300">Your rival</p>
                    <h3 className="mt-1 text-xl font-black text-white">RAMBO<span className="text-lime-300">.</span></h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {loading ? "Loading bot performance…" : "Rambo's leaderboard stats are not available right now."}
                </p>
                {botError ? (
                  <p className="mt-3 text-xs text-slate-400">{botError}</p>
                ) : botNumbers ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[9px] font-bold uppercase text-slate-500">First round</p>
                      <p className="mt-2 break-words text-sm font-bold text-white">{botNumbers.first}</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[9px] font-bold uppercase text-slate-500">Second round</p>
                      <p className="mt-2 break-words text-sm font-bold text-white">{botNumbers.second}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 animate-pulse text-xs text-slate-400">Checking today's predictions…</p>
                )}
                <a href="/contest/predict" className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-lime-300 px-4 py-3 text-xs font-black text-slate-950 transition hover:bg-lime-200">
                  CHALLENGE RAMBO →
                </a>
              </article>
            )}
          </div>
        </div>
      </section>
      <div id="leaderboard" className="overflow-hidden rounded-3xl border border-white/10 bg-[#101827] shadow-xl">
        <div className="border-b border-white/10 p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-300">
                The rankings
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                LEADERBOARD<span className="text-lime-300">.</span>
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                Every hit counts. Check your points and see who is leading the arena.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contestants</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-white">
                {loading ? '—' : rows.length}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Leaderboard period">
            {([
              ['all', 'All time'],
              ['7', '7 days'],
              ['30', '30 days'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPeriod(value)}
                aria-pressed={period === value}
                className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                  period === value
                    ? 'border-lime-300 bg-lime-300 text-slate-950'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-lime-300" />
            <p className="mt-3 text-sm text-slate-400">Loading the standings…</p>
          </div>
        )}

        {error && (
          <p role="alert" className="m-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </p>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-3xl">🏁</p>
            <p className="mt-3 font-bold text-white">The race starts here.</p>
            <p className="mt-1 text-sm text-slate-400">No contestants yet. Be the first to join.</p>
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <>
            <div className="space-y-2 p-3 sm:hidden">
              {rows.map((row, index) => (
                <article
                  key={row.contestant_id}
                  className={`rounded-2xl border p-4 ${
                    index === 0
                      ? 'border-lime-300/40 bg-lime-300/[0.07]'
                      : 'border-white/[0.07] bg-white/[0.025]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                      index === 0
                        ? 'bg-lime-300 text-slate-950'
                        : index === 1
                          ? 'bg-slate-300 text-slate-950'
                          : index === 2
                            ? 'bg-orange-300 text-slate-950'
                            : 'bg-white/10 text-slate-300'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-bold text-white">
                        {row.display_name === 'Random Bot' ? 'Rambo' : row.display_name}
                      </p>
                      {row.contestant_type === 'bot' && (
                        <span className="mt-1 inline-flex rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Bot rival
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Points</p>
                      <p className="text-2xl font-black tabular-nums text-lime-300">{row.total_points}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Hits</p>
                      <p className="mt-1 font-bold text-white">{row.hits}<span className="font-normal text-slate-500"> / {row.attempts}</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Accuracy</p>
                      <p className="mt-1 font-bold text-white">{row.accuracy}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Standing</p>
                      <p className="mt-1 font-bold text-lime-300">{index === 0 ? 'Leader' : `#${index + 1}`}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[580px] text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.025] text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-3 py-4">Contestant</th>
                    <th className="px-3 py-4 text-right">Points</th>
                    <th className="px-3 py-4 text-right">Attempts</th>
                    <th className="px-3 py-4 text-right">Hits</th>
                    <th className="px-6 py-4 text-right">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.contestant_id}
                      className={`border-b border-white/[0.06] last:border-0 transition hover:bg-white/[0.035] ${
                        index === 0 ? 'bg-lime-300/[0.035]' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-black tabular-nums ${
                          index === 0
                            ? 'bg-lime-300 text-slate-950'
                            : 'bg-white/[0.07] text-slate-300'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-3 py-4 font-bold text-white">
                        {row.display_name === 'Random Bot' ? 'Rambo' : row.display_name}
                        {row.contestant_type === 'bot' && (
                          <span className="ml-2 rounded-md bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Bot
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-right text-lg font-black tabular-nums text-lime-300">{row.total_points}</td>
                      <td className="px-3 py-4 text-right tabular-nums text-slate-300">{row.attempts}</td>
                      <td className="px-3 py-4 text-right tabular-nums text-slate-300">{row.hits}</td>
                      <td className="px-6 py-4 text-right font-bold tabular-nums text-white">{row.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="border-t border-white/10 px-5 py-3 text-xs text-slate-500 sm:px-7">
          Rankings reflect points earned from matching predictions.
        </div>
      </div>


    </section>
  )
}
