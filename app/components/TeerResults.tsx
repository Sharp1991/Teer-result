'use client';

import { useEffect, useState } from 'react';

interface TeerResult {
  date: string;
  firstRound: string;
  secondRound: string;
  location: string;
  status: 'live' | 'cached';
}

type Tab = 'overview' | 'statistics' | 'history';

function formatDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function shortDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

function validNumber(value: string) {
  return /^\d{2}$/.test(value);
}

function getFrequency(values: string[]) {
  const frequency: Record<string, number> = {};

  for (let i = 0; i < 100; i++) {
    frequency[i.toString().padStart(2, '0')] = 0;
  }

  values.forEach((value) => {
    if (validNumber(value)) {
      frequency[value] = (frequency[value] || 0) + 1;
    }
  });

  return frequency;
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function getPeriodResults(
  results: TeerResult[],
  field: 'firstRound' | 'secondRound',
  periodKey: string
) {
  const valid = results.filter((r) => validNumber(r[field]))

  if (periodKey === '20') return valid.slice(-20)
  if (periodKey === '50') return valid.slice(-50)
  if (periodKey === '100') return valid.slice(-100)
  if (periodKey === '500') return valid.slice(-500)

  if (periodKey === '1y' || periodKey === '2y') {
    if (!results.length) return []

    const latestDate = new Date(
      `${results[results.length - 1].date}T00:00:00`
    )

    const startDate = new Date(latestDate)
    startDate.setFullYear(
      startDate.getFullYear() - (periodKey === '1y' ? 1 : 2)
    )

    return valid.filter(
      (r) => new Date(`${r.date}T00:00:00`) >= startDate
    )
  }

  return valid
}

function getLongestMissing(
  results: TeerResult[],
  field: 'firstRound' | 'secondRound'
) {
  const valid = results.filter((r) => validNumber(r[field]))
  const latestIndex = valid.length - 1

  return Array.from({ length: 100 }, (_, i) => {
    const number = i.toString().padStart(2, '0')

    let lastIndex = -1
    let lastDate: string | null = null

    for (let j = latestIndex; j >= 0; j--) {
      if (valid[j][field] === number) {
        lastIndex = j
        lastDate = valid[j].date
        break
      }
    }

    return {
      number,
      gap: lastIndex === -1 ? valid.length : latestIndex - lastIndex,
      lastDate,
    }
  }).sort(
    (a, b) =>
      b.gap - a.gap ||
      a.number.localeCompare(b.number)
  )
}

export default function TeerResults() {
  const [todayResult, setTodayResult] = useState<TeerResult | null>(null);
  const [history, setHistory] = useState<TeerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [historyPage, setHistoryPage] = useState(1);
  const [statsRound, setStatsRound] = useState<'firstRound' | 'secondRound'>('firstRound');
  const [statsPeriod, setStatsPeriod] = useState('100');
  const historyPerPage = 20;

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/results', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (data.success) {
        setTodayResult(data.today || null);
        setHistory(data.history || []);
      } else {
        setError(data.error || 'Failed to load results');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl py-20 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
        <p className="mt-4 text-sm text-slate-500">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="font-bold text-red-800">Unable to load results</h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchResults}
            className="mt-5 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allResults = todayResult
    ? [todayResult, ...history.filter((r) => r.date !== todayResult.date)]
    : history;

  const firstRoundValues = allResults.map((r) => r.firstRound);
  const secondRoundValues = allResults.map((r) => r.secondRound);

  const chronologicalResults = [...allResults].sort(
    (a, b) =>
      new Date(`${a.date}T00:00:00`).getTime() -
      new Date(`${b.date}T00:00:00`).getTime()
  );

  const validStatsResults = chronologicalResults.filter(
    (r) => validNumber(r[statsRound])
  );

  const latestStatsDate = chronologicalResults.length
    ? chronologicalResults[chronologicalResults.length - 1].date
    : '';

  let statsResults = validStatsResults;

  if (statsPeriod === '20') {
    statsResults = validStatsResults.slice(-20);
  } else if (statsPeriod === '50') {
    statsResults = validStatsResults.slice(-50);
  } else if (statsPeriod === '100') {
    statsResults = validStatsResults.slice(-100);
  } else if (statsPeriod === '500') {
    statsResults = validStatsResults.slice(-500);
  } else if (statsPeriod === '1y' || statsPeriod === '2y') {
    const latestDate = new Date(`${latestStatsDate}T00:00:00`);
    const startDate = new Date(latestDate);

    startDate.setFullYear(
      startDate.getFullYear() - (statsPeriod === '1y' ? 1 : 2)
    );

    statsResults = validStatsResults.filter(
      (r) => new Date(`${r.date}T00:00:00`) >= startDate
    );
  }

  const statsFrequency = getFrequency(
    statsResults.map((r) => r[statsRound])
  );

  const mostAppeared = Object.entries(statsFrequency)
    .map(([number, count]) => ({ number, count }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.number.localeCompare(b.number)
    )
    .slice(0, 10);

  const longestMissing = getLongestMissing(
    chronologicalResults,
    statsRound
  ).slice(0, 10);

  const historyTotalPages = Math.ceil(allResults.length / historyPerPage);
  const historyStart = (historyPage - 1) * historyPerPage;
  const paginatedHistory = allResults.slice(historyStart, historyStart + historyPerPage);

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 -mx-4 border-b border-slate-800 bg-slate-950 px-4 py-3 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            onClick={() => setTab('overview')}
            className="text-left"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Shillong
            </p>
            <p className="mt-0.5 text-sm font-black tracking-tight text-white">
              TEER RESULTS
            </p>
          </button>

          <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-inner">
            {[
              ['overview', 'Results'],
              ['statistics', 'Statistics'],
              ['history', 'History'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value as Tab)}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                  tab === value
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {tab === 'overview' && (
        <>
          {/* Hero */}
          <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  TODAY&apos;S TEER RESULT
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {todayResult ? formatDate(todayResult.date) : 'No result'}
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  {todayResult?.location || 'Shillong'} ·{' '}
                  {todayResult?.status === 'live'
                    ? 'Live result'
                    : 'Latest available result'}
                </p>
              </div>

              <button
                onClick={fetchResults}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold hover:bg-slate-800"
              >
                ↻ Refresh
              </button>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-5 text-slate-900">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  First Round
                </p>
                <p className="mt-2 font-mono text-5xl font-black tracking-tight">
                  {todayResult?.firstRound || '--'}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 text-slate-900">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Second Round
                </p>
                <p className="mt-2 font-mono text-5xl font-black tracking-tight">
                  {todayResult?.secondRound || '--'}
                </p>
              </div>
            </div>
          </section>

          {/* Recent */}
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Results
                </h2>
                <p className="text-sm text-slate-500">
                  Latest available results
                </p>
              </div>

              <button
                onClick={() => setTab('history')}
                className="text-sm font-semibold text-slate-700"
              >
                View all
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {allResults.slice(0, 10).map((result, index) => (
                <div
                  key={`${result.date}-${index}`}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {formatDate(result.date)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {result.location}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      FR
                    </p>
                    <p className="font-mono text-lg font-bold text-slate-900">
                      {result.firstRound || '--'}
                    </p>
                  </div>

                  <div className="min-w-[45px] text-right">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      SR
                    </p>
                    <p className="font-mono text-lg font-bold text-slate-900">
                      {result.secondRound || '--'}
                    </p>
                  </div>
                </div>
              ))}

              {allResults.length === 0 && (
                <p className="p-8 text-center text-sm text-slate-400">
                  No results available.
                </p>
              )}
            </div>
          </section>

          {/* Data Centre teaser */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Data Centre
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Explore Teer statistics
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Examine historical frequencies, digit distributions, odd/even
              patterns and number ranges. First Round and Second Round are
              analysed independently.
            </p>

            <button
              onClick={() => setTab('statistics')}
              className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Open Data Centre
            </button>
          </section>
        </>
      )}

      {tab === 'statistics' && (
        <section className="space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Data Centre
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              Teer Statistics
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Frequency and missing-number statistics from recorded results.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                ['firstRound', 'First Round'],
                ['secondRound', 'Second Round'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() =>
                    setStatsRound(value as 'firstRound' | 'secondRound')
                  }
                  className={`rounded-lg px-4 py-2 text-xs font-semibold ${
                    statsRound === value
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              value={statsPeriod}
              onChange={(e) => setStatsPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              <option value="20">Last 20 draws</option>
              <option value="50">Last 50 draws</option>
              <option value="100">Last 100 draws</option>
              <option value="500">Last 500 draws</option>
              <option value="1y">Last 1 year</option>
              <option value="2y">Last 2 years</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Top 10 Most Appeared
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {statsResults.length} draws analysed
                  </p>
                </div>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {mostAppeared.map((item, index) => (
                  <div
                    key={item.number}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-slate-400">
                        {index + 1}
                      </span>
                      <span className="font-mono text-lg font-black text-slate-900">
                        {item.number}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      {item.count} times
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">
                Top 10 Longest Missing
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Current gap based on all recorded results
              </p>

              <div className="mt-4 divide-y divide-slate-100">
                {longestMissing.map((item, index) => (
                  <div
                    key={item.number}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-slate-400">
                        {index + 1}
                      </span>
                      <span className="font-mono text-lg font-black text-slate-900">
                        {item.number}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      {item.gap} draws
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === 'history' && (
        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Archive
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              Historical Results
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Recorded Shillong Teer results.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Date</span>
              <span>FR</span>
              <span>SR</span>
            </div>

            {paginatedHistory.map((result, index) => (
              <div
                key={`${result.date}-${index}`}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {formatDate(result.date)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {shortDate(result.date)}
                  </p>
                </div>

                <span className="font-mono text-lg font-bold text-slate-900">
                  {result.firstRound || '--'}
                </span>

                <span className="font-mono text-lg font-bold text-slate-900">
                  {result.secondRound || '--'}
                </span>
              </div>
            ))}

            {allResults.length === 0 && (
              <p className="p-10 text-center text-sm text-slate-400">
                No historical results available.
              </p>
            )}
          </div>

          {allResults.length > 0 && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}
                disabled={historyPage === 1}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <p className="text-xs text-slate-500">
                {historyStart + 1}–{Math.min(historyStart + historyPerPage, allResults.length)} of {allResults.length}
              </p>

              <button
                onClick={() => setHistoryPage((page) => Math.min(historyTotalPages, page + 1))}
                disabled={historyPage === historyTotalPages}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      <footer className="border-t border-slate-200 py-8 text-center">
        <p className="text-xs text-slate-400">
          Shillong Teer Results · Historical statistics and results
        </p>
      </footer>
    </div>
  );
}
