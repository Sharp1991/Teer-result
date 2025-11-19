"use client";
import { useState, useEffect } from "react";

export default function TeerStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <p className="mt-2 text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        Statistics unavailable
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold text-gray-800">📊 Teer Statistics</h2>
        <p className="text-gray-600 mt-1">Starting with hot numbers analysis</p>
      </div>

      <div className="p-6">
        {/* Hot Numbers - Last 60 Days */}
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
            <span className="mr-2">🔥</span>
            Hot Numbers (Last 60 Days) - Top 10
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {stats.hotNumbersLast60.map((item, index) => (
              <div key={item.number} className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{item.number}</div>
                <div className="text-sm text-red-600 mt-1">{item.count} appearances</div>
                <div className="text-xs text-red-500 mt-1">Rank #{index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center pt-6">
          <button
            onClick={fetchStatistics}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh Statistics
          </button>
        </div>
      </div>
    </div>
  );
}
