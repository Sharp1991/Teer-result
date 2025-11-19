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
      <div className="text-center py-16">
        <div className="animate-spin w-12 h-12 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading live statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16 text-gray-500 text-lg">
        Statistics unavailable - Please try again later
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hot Numbers */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-red-700 mb-6">🔥 Hot Numbers (Last 60 Days)</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.hotNumbersLast60.map((item, index) => (
            <div key={item.number} className="text-center p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:shadow-lg transition-all">
              <div className="text-3xl font-bold text-red-700">{item.number.toString().padStart(2, '0')}</div>
              <div className="text-sm text-red-600 mt-2">{item.count} appearances</div>
              <div className="text-xs text-red-500 mt-1 font-semibold">Rank #{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Due Numbers */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">⏰ Due Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.dueNumbers && stats.dueNumbers.slice(0, 10).map((item, index) => (
            <div key={item.number} className="text-center p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all">
              <div className="text-3xl font-bold text-blue-700">{item.number.toString().padStart(2, '0')}</div>
              <div className="text-sm text-blue-600 mt-2">{item.days} days ago</div>
              <div className="text-xs text-blue-500 mt-1 font-semibold">Overdue #{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Number Ranges */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6">📈 Number Range Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.numberRanges && stats.numberRanges.map((range, index) => (
            <div key={range.name} className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="text-xl font-bold text-green-700">{range.name}</div>
              <div className="text-2xl font-bold text-green-800 mt-2">{range.percentage}%</div>
              <div className="text-sm text-green-600 mt-1">{range.count} numbers</div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchStatistics}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
        >
          🔄 Refresh Live Data
        </button>
      </div>
    </div>
  );
}
