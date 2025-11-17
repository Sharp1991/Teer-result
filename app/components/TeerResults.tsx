'use client';

import { useState, useEffect } from 'react';

interface TeerResult {
  date: string;
  firstRound: string;
  secondRound: string;
  location: string;
  status: 'live' | 'cached';
}

export default function TeerResults() {
  const [todayResult, setTodayResult] = useState<TeerResult | null>(null);
  const [history, setHistory] = useState<TeerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/results');
      const data = await response.json();

      if (data.success) {
        setTodayResult(data.today);
        setHistory(data.history || []);
      } else {
        setError(data.error || 'Failed to load results');
      }
    } catch (err) {
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
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchResults}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center shadow">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          Shillong Teer Result
        </h1>
        <p className="text-blue-100 text-sm mt-1">
          Daily Official Updates • Accuracy Guaranteed
        </p>
      </div>

      {/* Today's Result */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Today’s Result
          </h2>

          <div className="flex justify-center items-center gap-3 text-sm text-gray-600 mt-2">
            <span>📍 {todayResult?.location || 'Shillong'}</span>
            <span>•</span>
            <span>📅 {todayResult?.date}</span>
            <span>•</span>

            {/* Live / Cached Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                todayResult?.status === 'live'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}
            >
              {todayResult?.status === 'live' ? 'LIVE' : 'CACHED'}
            </span>
          </div>
        </div>

        {/* Round Results */}
        <div className="grid grid-cols-2 gap-6">
          {/* 1st Round */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">1st Round</p>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 shadow-inner">
              <span className="text-5xl font-bold text-blue-700 tracking-wider">
                {todayResult?.firstRound || '--'}
              </span>
            </div>
          </div>

          {/* 2nd Round */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">2nd Round</p>
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-2xl p-6 shadow-inner">
              <span className="text-5xl font-bold text-indigo-700 tracking-wider">
                {todayResult?.secondRound || '--'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <h3 className="text-center text-lg font-semibold text-gray-800 mb-4">
          Last 7 Days Result History
        </h3>

        <div className="grid grid-cols-7 gap-3">
          {(history.length ? history : Array.from({ length: 7 })).map(
            (result: any, index: number) => {
              const dateObj = result
                ? new Date(result.date)
                : (() => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - index));
                    return d;
                  })();

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm text-center"
                >
                  <p className="text-[11px] text-gray-500 mb-1 font-medium">
                    {dateObj.getDate()}/{dateObj.getMonth() + 1}
                  </p>

                  <p
                    className={
                      result
                        ? 'text-blue-700 font-bold text-base'
                        : 'text-gray-300 font-bold text-base'
                    }
                  >
                    {result ? result.firstRound : '--'}
                  </p>

                  <p
                    className={
                      result
                        ? 'text-indigo-700 font-bold text-base'
                        : 'text-gray-300 font-bold text-base'
                    }
                  >
                    {result ? result.secondRound : '--'}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="border-t border-gray-200 p-5 bg-white text-center">
        <button
          onClick={fetchResults}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Results'}
        </button>
      </div>
    </div>
  );
}
