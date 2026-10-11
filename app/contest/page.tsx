import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Leaderboard from './Leaderboard'

export default async function ContestPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {}
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('leaderboard_profiles')
    .select('username')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profileError) {
    return (
      <main className="min-h-screen p-8 text-slate-900">
        We couldn't load your contest profile. Please try again later.
      </main>
    )
  }

  if (!profile) {
    redirect('/contest/username')
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Prediction Contest
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          Welcome, {profile.username}!
        </h1>
        <p className="mt-3 text-slate-600">
          Your public username is registered. The next step is building the
          daily prediction form and leaderboard.
        </p>
        <Link
          href="/contest/predict"
          className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Make today’s predictions
        </Link>
        </div>
        <Leaderboard />
      </div>
    </main>
  )
}
