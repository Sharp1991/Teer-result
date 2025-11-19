"use client";
import { useState, useEffect } from "react";

export default function TeerStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRound, setActiveRound] = useState("first");

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
  const roundColor = activeRound === "first" ? "blue" : "green";

  return (
    <div className="space-y-4">
      {/* Round Selector */}
      <div className="flex justify-center mb-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setActiveRound("first")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeRound === "first" 
                ? "bg-blue-600 text-white" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            First Round
          </button>
          <button
            onClick={() => setActiveRound("second")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeRound === "second" 
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
              <div className="text-xs text-red-600 mt-1">{item.count}</div>
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
