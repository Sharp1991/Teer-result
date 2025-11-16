"use client";

import React, { useEffect, useState } from "react";

interface Result {
  date: string;
  first: number;
  second: number;
}

export default function HomePage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => setResults(data))
      .finally(() => setLoading(false));
  }, []);

  const todayResult = results[0];
  const last5Days = results.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Shillong Teer Results</h1>
        <p className="text-indigo-100 mt-1">Latest results updated daily</p>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 mt-6">Loading results...</p>
        )}

        {!loading && todayResult && (
          <>
            {/* Today's Result */}
            <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Today's Result ({todayResult.date})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="font-medium">First Round</p>
                  <p className="text-xl font-bold text-green-600">{todayResult.first}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                  <p className="font-medium">Second Round</p>
                  <p className="text-xl font-bold text-yellow-600">{todayResult.second}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <p className="font-medium">Third Round</p>
                  <p className="text-xl font-bold text-red-600">{todayResult.third}</p>
                </div>
              </div>
            </section>

            {/* Last 5 Days */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Last 5 Days Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {last5Days.map((res, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-4">
                    <p className="font-medium text-gray-600">{res.date}</p>
                    <div className="flex justify-between mt-2">
                      <div className="text-center">
                        <p className="text-green-600 font-bold">{res.first}</p>
                        <p className="text-sm">First</p>
                      </div>
                      <div className="text-center">
                        <p className="text-yellow-600 font-bold">{res.second}</p>
                        <p className="text-sm">Second</p>
                      </div>
                      <div className="text-center">
                        <p className="text-red-600 font-bold">{res.third}</p>
                        <p className="text-sm">Third</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
