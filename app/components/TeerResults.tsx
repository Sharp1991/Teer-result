'use client';

import { useState, useEffect } from 'react';

interface TeerResult {
  date: string;
  firstRound: string;
  secondRound: string;
  time?: string;
  location?: string;
}

interface ApiResponse {
  results: TeerResult[];
  lastUpdated?: string;
  error?: string;
}

export default function TeerResults() {
  const [results, setResults] = useState<TeerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/results');
      const data: ApiResponse = await response.json();
      
      if (response.ok) {
        setResults(data.results || []);
        setLastUpdated(data.lastUpdated || '');
      } else {
        setError(data.error || 'Failed to fetch results from source');
      }
    } catch (err) {
      setError('Failed to connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching latest results from source...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-lg mb-2">⚠️ Unable to Load Results</div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchResults}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-2xl p-8 border-2 border-green-300"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                {result.date}
              </h3>
              {result.location && (
                <p className="text-lg text-gray-700 font-semibold">
                  📍 {result.location}
                </p>
              )}
              {result.time && (
                <p className="text-gray-600">⏰ {result.time}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2 uppercase tracking-wide">
                  First Round
                </div>
                <div className="text-5xl font-bold text-green-600 bg-green-50 py-4 rounded-lg border-2 border-green-200">
                  {result.firstRound}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2 uppercase tracking-wide">
                  Second Round
                </div>
                <div className="text-5xl font-bold text-blue-600 bg-blue-50 py-4 rounded-lg border-2 border-blue-200">
                  {result.secondRound}
                </div>
              </div>
            </div>

            {/* Source Info */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Data sourced directly from teertooday.com
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="text-center mt-8">
        <button
          onClick={fetchResults}
          disabled={loading}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Results'}
        </button>
      </div>

      {/* No Results Message */}
      {results.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-700 text-lg">No results available at the moment</p>
            <p className="text-yellow-600 text-sm mt-2">
              The source website might be updating or temporarily unavailable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
