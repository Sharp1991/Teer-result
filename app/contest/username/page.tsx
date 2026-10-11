'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-browser'

export default function UsernamePage() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    const cleanUsername = username.trim()

    if (!/^[A-Za-z0-9_]{3,20}$/.test(cleanUsername)) {
      setMessage('Use 3–20 letters, numbers, or underscores.')
      return
    }

    setLoading(true)

    const { error } = await supabase.rpc('create_leaderboard_profile', {
      p_username: cleanUsername,
    })

    setLoading(false)

    if (error) {
      setMessage(
        error.message.toLowerCase().includes('duplicate') ||
        error.message.toLowerCase().includes('unique')
          ? 'That username is already taken. Please choose another.'
          : error.message
      )
      return
    }

    router.push('/contest')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Prediction Contest
        </p>
        <h1 className="mt-2 text-2xl font-bold">Choose your username</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This name will appear on the public leaderboard. Your email address
          will not be displayed.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Public username
            </label>
            <input
              id="username"
              name="username"
              required
              minLength={3}
              maxLength={20}
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. TeerPlayer24"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
            <p className="mt-2 text-xs text-slate-500">
              3–20 characters. Letters, numbers, and underscores only.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Join the leaderboard'}
          </button>
        </form>

        {message && (
          <p role="status" className="mt-4 rounded-lg bg-slate-100 p-3 text-sm">
            {message}
          </p>
        )}
      </section>
    </main>
  )
}
