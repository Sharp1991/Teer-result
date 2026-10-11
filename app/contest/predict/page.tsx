'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-browser'

function NumberSlots({
  title,
  values,
  onChange,
}: {
  title: string
  values: string[]
  onChange: (index: number, value: string) => void
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {values.map((value, index) => (
          <label key={index} className="text-sm text-slate-600">
            Number {index + 1}
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={2}
              required
              pattern="[0-9]{2}"
              value={value}
              onChange={(event) =>
                onChange(index, event.target.value.replace(/\D/g, '').slice(0, 2))
              }
              placeholder="00"
              aria-label={`${title} number ${index + 1}`}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 text-center text-lg font-semibold tracking-widest outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        ))}
      </div>
    </section>
  )
}

export default function PredictPage() {
  const [first, setFirst] = useState(Array(10).fill(''))
  const [second, setSecond] = useState(Array(10).fill(''))
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSaved, setLoadingSaved] = useState(true)

  useEffect(() => {
    let active = true

    async function loadSavedPredictions() {
      const { data, error } = await supabase.rpc('get_my_teer_predictions')
      if (!active) return

      if (error) {
        setMessage(error.message)
      } else if (data && data.length > 0) {
        setFirst(data[0].first_round)
        setSecond(data[0].second_round)
        setMessage('Your saved predictions are loaded. You can edit them before 3:00 PM IST.')
      }

      setLoadingSaved(false)
    }

    loadSavedPredictions()
    return () => { active = false }
  }, [])

  function updateSlot(
    round: 'first' | 'second',
    index: number,
    value: string
  ) {
    if (round === 'first') {
      setFirst((current) =>
        current.map((item, i) => (i === index ? value : item))
      )
    } else {
      setSecond((current) =>
        current.map((item, i) => (i === index ? value : item))
      )
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (
      [...first, ...second].some((value) => !/^\d{2}$/.test(value))
    ) {
      setMessage('Fill all 20 slots with two-digit numbers from 00 to 99.')
      return
    }

    setLoading(true)

    const { error } = await supabase.rpc('submit_teer_predictions', {
      p_first_round: first,
      p_second_round: second,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Your predictions have been saved. You can edit them before 3:00 PM IST.')
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/contest"
          className="text-sm font-medium text-emerald-700"
        >
          ← Back to contest
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Daily Prediction Contest
          </p>
          <h1 className="mt-2 text-3xl font-bold">Submit your numbers</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter 10 numbers for each round. Use two digits for every entry,
            from 00 to 99. Repeated numbers are allowed. Each matching slot
            earns 80 points.
          </p>
          <p className="mt-2 text-sm font-semibold text-amber-700">
            Deadline: 3:00 PM India time. Save or edit before the cutoff.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <NumberSlots
            title="First Round"
            values={first}
            onChange={(index, value) => updateSlot('first', index, value)}
          />

          <NumberSlots
            title="Second Round"
            values={second}
            onChange={(index, value) => updateSlot('second', index, value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-emerald-700 px-5 py-4 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? 'Saving predictions…' : 'Save predictions'}
          </button>
        </form>

        {message && (
          <p
            role="status"
            className="mt-4 break-words rounded-lg bg-white p-4 text-sm shadow-sm"
          >
            {message}
          </p>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Predictions are for a friendly scoring competition, not a guarantee
          of future results. Submit only if you choose to participate.
        </p>
      </div>
    </main>
  )
}
