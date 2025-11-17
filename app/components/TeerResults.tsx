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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header - Inspired by archery counter */}
      <div className="bg-green-800 text-white p-4 text-center">
        <h1 className="text-2xl font-bold tracking-wide">TEER RESULT COUNTER</h1>
        <p className="text-sm opacity-90 mt-1">License: ONLINE</p>
      </div>

      {/* Today's Result Section */}
      <div className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">TODAY'S RESULT</h2>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
            <span>📍 {todayResult?.location || 'SHILLONG'}</span>
            <span>•</span>
            <span>📅 {todayResult?.date || new Date().toLocaleDateString('en-IN')}</span>
            <span>•</span>
            <span className={`font-semibold ${todayResult?.status === 'live' ? 'text-green-600' : 'text-amber-600'}`}>
              {todayResult?.status === 'live' ? '🟢 LIVE' : '🟡 CACHED'}
            </span>
          </div>
        </div>
        
        {/* Rounds Display */}
        <div className="grid grid-cols-2 gap-6 mb-2">
          {/* First Round */}
          <div className="text-center">
            <div className="text-lg font-medium text-gray-700 mb-3">1st Round</div>
            <div className="bg-green-50 border-4 border-green-400 rounded-xl p-5 shadow-inner">
              <div className="text-5xl font-bold text-green-800 tracking-wider">
                {todayResult?.firstRound || '--'}
              </div>
            </div>
          </div>

          {/* Second Round */}
          <div className="text-center">
            <div className="text-lg font-medium text-gray-700 mb-3">2nd Round</div>
            <div className="bg-blue-50 border-4 border-blue-400 rounded-xl p-5 shadow-inner">
              <div className="text-5xl font-bold text-blue-800 tracking-wider">
                {todayResult?.secondRound || '--'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="border-t border-gray-300 bg-gray-50 p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">LAST 7 DAYS HISTORY</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-3 text-center">
          {history.length > 0 ? (
            history.map((result, index) => (
              <div key={index} className="bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
                <div className="text-xs text-gray-500 font-medium mb-1">
                  {new Date(result.date).getDate()}/{new Date(result.date).getMonth() + 1}
                </div>
                <div className="text-base font-bold text-green-700 mb-1">
                  {result.firstRound}
                </div>
                <div className="text-base font-bold text-blue-700">
                  {result.secondRound}
                </div>
              </div>
            ))
          ) : (
            // Show placeholder when no history
            Array.from({ length: 7 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - index));
              return (
                <div key={index} className="bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    {date.getDate()}/{date.getMonth() + 1}
                  </div>
                  <div className="text-base font-bold text-gray-400 mb-1">--</div>
                  <div className="text-base font-bold text-gray-400">--</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="border-t border-gray-300 p-4 bg-white text-center">
        <button
          onClick={fetchResults}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Results'}
        </button>
      </div>
    </div>
  );
}
