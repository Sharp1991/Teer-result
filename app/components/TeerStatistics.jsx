"use client";
import { useState, useEffect } from "react";

export default function TeerStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRound, setActiveRound] = useState("firstRound");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const res = await fetch('/api/statistics');
      const data = await res.json();
      if (data.success) setStats(data.statistics);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600 text-sm">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Statistics unavailable - Please try again later
      </div>
    );
  }

  const roundData = stats[activeRound];
  const isFirstRound = activeRound === "firstRound";

  return (
    <div className="space-y-4">
      {/* Round Selector */}
      <div className="flex justify-center mb-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setActiveRound("firstRound")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isFirstRound 
                ? "bg-blue-600 text-white" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            First Round
          </button>
          <button
            onClick={() => setActiveRound("secondRound")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isFirstRound 
                ? "bg-green-600 text-white" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Second Round
          </button>
        </div>
      </div>

      {/* Hot Numbers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          🔥 Hot Numbers
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.hotNumbers.map((item) => (
            <div key={item.number} className="text-center p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="text-lg font-bold text-red-700">{item.number}</div>
              <div className="text-xs text-red-600 mt-1">{item.count}x</div>
            </div>
          ))}
        </div>
      </div>

      {/* Due Numbers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          ⏰ Due Numbers
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.dueNumbers.map((item) => (
            <div key={item.number} className="text-center p-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-lg font-bold text-blue-700">{item.number}</div>
              <div className="text-xs text-blue-600 mt-1">{item.days}d</div>
            </div>
          ))}
        </div>
      </div>

      {/* Longest Gaps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          📅 Longest Gaps
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.longestGaps.map((item) => (
            <div key={item.number} className="text-center p-2 bg-purple-50 border border-purple-200 rounded-md">
              <div className="text-lg font-bold text-purple-700">{item.number}</div>
              <div className="text-xs text-purple-600 mt-1">{item.days}d</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shortest Gaps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          ⚡ Shortest Gaps
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.shortestGaps.map((item) => (
            <div key={item.number} className="text-center p-2 bg-orange-50 border border-orange-200 rounded-md">
              <div className="text-lg font-bold text-orange-700">{item.number}</div>
              <div className="text-xs text-orange-600 mt-1">{item.days}d</div>
            </div>
          ))}
        </div>
      </div>

      {/* High Probability */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          📊 High Probability
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.highProbability.map((item) => (
            <div key={item.number} className="text-center p-2 bg-green-50 border border-green-200 rounded-md">
              <div className="text-lg font-bold text-green-700">{item.number}</div>
              <div className="text-xs text-green-600 mt-1">{item.probability}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Probability */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          📉 Low Probability
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.lowProbability.map((item) => (
            <div key={item.number} className="text-center p-2 bg-gray-100 border border-gray-300 rounded-md">
              <div className="text-lg font-bold text-gray-700">{item.number}</div>
              <div className="text-xs text-gray-600 mt-1">{item.probability}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Up */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          🔼 Trending Up
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.trendingUp.map((item) => (
            <div key={item.number} className="text-center p-2 bg-teal-50 border border-teal-200 rounded-md">
              <div className="text-lg font-bold text-teal-700">{item.number}</div>
              <div className="text-xs text-teal-600 mt-1">+{item.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Down */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 text-center">
          🔽 Trending Down
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {roundData.trendingDown.map((item) => (
            <div key={item.number} className="text-center p-2 bg-pink-50 border border-pink-200 rounded-md">
              <div className="text-lg font-bold text-pink-700">{item.number}</div>
              <div className="text-xs text-pink-600 mt-1">{item.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center pt-2">
        <button
          onClick={fetchStatistics}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}
