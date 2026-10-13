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

  if (authError || !user) redirect('/login')

  const { data: profile, error: profileError } = await supabase
    .from('leaderboard_profiles')
    .select('username')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profileError) {
    return (
      <main className="min-h-screen bg-[#080d19] p-6 text-white">
        We couldn't load your contest profile. Please try again later.
      </main>
    )
  }

  if (!profile) redirect('/contest/username')

  return (
    <main className="min-h-screen bg-[#080d19] px-3 py-6 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-5">
          <Link href="/contest" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-300 text-xl font-black text-slate-950">
              ST
            </span>
            <span>
              <span className="block text-sm font-black tracking-wide text-white sm:text-base">
                SHILLONG TEER
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-lime-300">
                Prediction arena
              </span>
            </span>
          </Link>
          <span className="rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-lime-300 sm:text-xs">
            Contest hub
          </span>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#17243a] via-[#101a2c] to-[#101c20] p-6 shadow-2xl sm:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-lime-300/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-lime-300">
              <span className="h-2 w-2 rounded-full bg-lime-300" />
              Your arena is ready
            </div>

            <p className="mt-6 text-sm font-medium text-slate-400">
              WELCOME BACK, {profile.username.toUpperCase()}
            </p>
            <h1 className="mt-2 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              TRUST YOUR
              <br />
              <span className="text-lime-300">NUMBERS.</span>
              <br />
              BEAT THE REST.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Make your picks for both Shillong Teer rounds, collect points when your predictions match, and climb the leaderboard.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contest/predict"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lime-300 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-lime-300/10 transition hover:bg-lime-200"
              >
                MAKE YOUR PREDICTIONS <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#leaderboard"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                View leaderboard
              </a>
            </div>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:max-w-xl">
            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Round 01</p>
              <p className="mt-1 text-lg font-black text-white">FR</p>
              <p className="mt-1 text-xs text-slate-400">First round predictions</p>
            </div>
            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Round 02</p>
              <p className="mt-1 text-lg font-black text-white">SR</p>
              <p className="mt-1 text-xs text-slate-400">Second round predictions</p>
            </div>
          </div>
        </section>

        <div className="scroll-mt-5">
          <Leaderboard />
        </div>

        <footer className="mt-10 border-t border-white/10 py-5 text-center text-xs text-slate-500">
          SHILLONG TEER PREDICTION ARENA · PLAY SMART · TRACK YOUR PROGRESS
        </footer>
      </div>
    </main>
  )
}
