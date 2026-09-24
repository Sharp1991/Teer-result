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

function RoundStatistics({
  title,
  values,
}: {
  title: string;
  values: string[];
}) {
  const frequency = getFrequency(values);
  const validValues = values.filter(validNumber);

  const ranked = Object.entries(frequency)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const odd = validValues.filter((v) => Number(v) % 2 !== 0).length;
  const even = validValues.length - odd;

  const low = validValues.filter((v) => Number(v) < 50).length;
  const high = validValues.length - low;

  const firstDigits = Array(10).fill(0);
  const lastDigits = Array(10).fill(0);

  validValues.forEach((v) => {
    firstDigits[Number(v[0])]++;
    lastDigits[Number(v[1])]++;
  });

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">
          Historical statistics for this round only.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Records"
          value={validValues.length.toString()}
          description="Usable results"
        />
        <StatCard
          label="Unique"
          value={new Set(validValues).size.toString()}
          description="Different numbers"
        />
        <StatCard
          label="Odd"
          value={odd.toString()}
          description="Odd results"
        />
        <StatCard
          label="Even"
          value={even.toString()}
          description="Even results"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="font-semibold text-slate-900">Range distribution</h4>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">00–49</p>
            <p className="mt-1 text-xl font-bold">{low}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">50–99</p>
            <p className="mt-1 text-xl font-bold">{high}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="font-semibold text-slate-900">Number frequency</h4>
        <p className="mt-1 text-xs text-slate-500">
          Frequency is descriptive historical data, not a prediction.
        </p>

        {ranked.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            More historical data is required.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {ranked.slice(0, 10).map(([number, count]) => (
              <div key={number} className="flex items-center gap-3">
                <span className="w-8 font-mono font-bold text-slate-800">
                  {number}
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-700"
                    style={{
                      width: `${Math.max(
                        8,
                        (count / ranked[0][1]) * 100
                      )}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-sm font-semibold text-slate-600">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="font-semibold text-slate-900">First digit</h4>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {firstDigits.map((count, digit) => (
            <div
              key={digit}
              className="rounded-xl bg-slate-50 p-3 text-center"
            >
              <p className="font-mono font-bold">{digit}</p>
              <p className="mt-1 text-xs text-slate-500">{count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="font-semibold text-slate-900">Last digit</h4>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {lastDigits.map((count, digit) => (
            <div
              key={digit}
              className="rounded-xl bg-slate-50 p-3 text-center"
            >
              <p className="font-mono font-bold">{digit}</p>
              <p className="mt-1 text-xs text-slate-500">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TeerResults() {
  const [todayResult, setTodayResult] = useState<TeerResult | null>(null);
  const [history, setHistory] = useState<TeerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');

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

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Shillong
            </p>
            <p className="font-bold text-slate-900">Teer Results</p>
          </div>

          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {[
              ['overview', 'Results'],
              ['statistics', 'Statistics'],
              ['history', 'History'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value as Tab)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  tab === value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500'
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
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Statistical summaries of recorded results. First Round and
              Second Round remain completely separate.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Current view:</strong> statistics are calculated from the
            results currently returned by the existing API. The full historical
            base dataset will be connected next.
          </div>

          <RoundStatistics title="First Round" values={firstRoundValues} />

          <div className="border-t border-slate-200 pt-8">
            <RoundStatistics title="Second Round" values={secondRoundValues} />
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

            {allResults.map((result, index) => (
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
