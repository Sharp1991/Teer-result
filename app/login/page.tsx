'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithGoogle() {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    }
  }

  async function signInWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setMessage(
      error
        ? error.message
        : 'Check your email for the sign-in link.'
    )
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-medium text-emerald-700">
          ← Back to Shillong Teer Results
        </Link>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Prediction Contest
          </p>
          <h1 className="mt-2 text-2xl font-bold">
            Sign in to compete
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Submit your daily predictions, earn points for matching results,
            and compare your performance on the leaderboard.
          </p>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold hover:bg-slate-50 disabled:opacity-60"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            OR CONTINUE WITH EMAIL
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={signInWithEmail} className="space-y-3">
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? 'Please wait…' : 'Send sign-in link'}
            </button>
          </form>

          {message && (
            <p role="status" className="mt-4 rounded-lg bg-slate-100 p-3 text-sm">
              {message}
            </p>
          )}

          <p className="mt-6 text-xs leading-5 text-slate-500">
            Your email is used for sign-in and is not your public leaderboard
            name. You will choose a username before making predictions.
          </p>
        </section>
      </div>
    </main>
  )
}
