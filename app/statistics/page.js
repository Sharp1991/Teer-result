import TeerStatistics from '../components/TeerStatistics'

export const metadata = {
  title: 'Shillong Teer Analytics & Statistics | Number Frequency',
  description:
    'Explore Shillong Teer statistics, historical number frequency, hot numbers, missing numbers, and round-by-round analysis.',
  alternates: {
    canonical: '/statistics',
    languages: {
      en: '/statistics',
      bn: '/bn/statistics',
      'x-default': '/statistics',
    },
  },
  openGraph: {
    title: 'Shillong Teer Analytics & Statistics | Number Frequency',
    description:
      'Explore Shillong Teer statistics, historical number frequency, hot numbers, missing numbers, and round-by-round analysis.',
    url: '/statistics',
    siteName: 'Shillong Teer Results',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function StatisticsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="sticky top-0 z-10 -mx-4 border-b border-slate-800 bg-slate-950 px-4 py-3 shadow-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <a href="/" className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Shillong
              </p>
              <p className="mt-0.5 text-sm font-black tracking-tight text-white">
                TEER RESULTS
              </p>
            </a>

            <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-inner">
              <a
                href="/"
                className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
              >
                Results
              </a>
              <a
                href="/statistics"
                className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-950 shadow-sm"
              >
                Statistics
              </a>
              <a
                href="/history"
                className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
              >
                History
              </a>              <a
                href="/dream-number"
                className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
              >
                Dream Number
              </a>
            </div>
          </div>
        </nav>

        <div className="mt-4 flex justify-end">
          <a
            href="/bn/statistics"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            বাংলা
          </a>
        </div>

        <section className="mt-6 rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-medium text-slate-400">
            Shillong Teer Data Centre
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            📊 Shillong Teer Analytics &amp; Statistics
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Explore Shillong Teer results through number frequency, hot and cold numbers, missing numbers, number gaps and round-by-round historical analysis.
          </p>
        </section>

        <div className="mt-6">
          <TeerStatistics language="en" />
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            About Shillong Teer Analytics
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              Shillong Teer Analytics helps you explore historical Shillong Teer results through number frequency, appearance gaps and round-by-round patterns.
            </p>
            <p>
              The Data Centre covers both First Round and Second Round results, including hot numbers, cold numbers, frequently appearing numbers and numbers that have been absent for longer periods.
            </p>
            <p>
              Use the statistics to study historical results and number trends over different periods. The data is presented for analysis and reference and should not be treated as a prediction of future Teer results.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
