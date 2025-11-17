"use client";

import { useState, useEffect } from "react";

interface TeerResult {
  date: string;
  firstRound: string;
  secondRound: string;
  location: string;
  status: "live" | "cached";
}

export default function TeerResults() {
  const [todayResult, setTodayResult] = useState<TeerResult | null>(null);
  const [history, setHistory] = useState<TeerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/results");
      const data = await res.json();

      if (data.success) {
        setTodayResult(data.today);
        setHistory(data.history || []);
      } else {
        setError(data.error || "Failed to load results");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading)
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-10 h-10 rounded-full border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading results…</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl max-w-md mx-auto">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchResults}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      {/* TODAY RESULT CARD — OPTION A (Professional Clean Card) */}
      <div className="bg-white border border-blue-200 shadow-sm rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-bold text-blue-700 text-center mb-4">
          Today’s Teer Result
        </h2>

        <div className="flex justify-center gap-3 text-sm text-gray-600 mb-4">
          <span>📍 {todayResult?.location}</span>
          <span>•</span>
          <span>📅 {todayResult?.date}</span>
          <span>•</span>
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
              todayResult?.status === "live"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-yellow-100 text-yellow-700 border border-yellow-300"
            }`}
          >
            {todayResult?.status === "live" ? "LIVE" : "CACHED"}
          </span>
        </div>

        {/* Rounds */}
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-gray-700 font-medium mb-1">1st Round</p>
            <p className="text-5xl font-bold text-blue-700">
              {todayResult?.firstRound || "--"}
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
            <p className="text-gray-700 font-medium mb-1">2nd Round</p>
            <p className="text-5xl font-bold text-indigo-700">
              {todayResult?.secondRound || "--"}
            </p>
          </div>
        </div>
      </div>

      {/* HISTORY — VERTICAL LIST (Much Cleaner) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Last 7 Days Previous Results
        </h3>

        <div className="space-y-4">
          {history.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div>
                <p className="text-sm text-gray-500">{h.date}</p>
                <p className="text-gray-800 font-medium">{h.location}</p>
              </div>

              <div className="text-right">
                <p className="text-blue-700 font-bold text-lg">
                  {h.firstRound}
                </p>
                <p className="text-indigo-700 font-bold text-lg">
                  {h.secondRound}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REFRESH BUTTON */}
      <div className="text-center">
        <button
          onClick={fetchResults}
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "🔄 Refresh Results"}
        </button>
      </div>
    </div>
  );
}
