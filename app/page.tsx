"use client";

import React, { useEffect, useState } from "react";

interface Result {
  date: string;
  first: number;
  second: number;
  third: number;
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

  const todayResult = results[0]; // assuming results are sorted by date desc

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Shillong Teer Results</h1>
        <p className="text-indigo-100 mt-1">Latest results updated daily</p>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading results....</p>
        ) : (
          <>
            {todayResult && (
              <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">Today's Result ({todayResult.date})</h2>
                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="font-medium">First Round</p>
                    <p className="text-xl font-bold text-green-600">{todayResult.first}</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <p className="font-medium">Second Round</p>
                    <p className="text-xl font-bold text-yellow-600">{todayResult.second}</p>
                  </div>
                  </div>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold mb-4">Last 5 Days Results</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">First</th>
                      <th className="py-2 px-4 text-left">Second</th>
                      <th className="py-2 px-4 text-left">Third</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((res, idx) => (
                      <tr
                        key={idx}
                        className={`border-t ${
                          idx === 0 ? "bg-indigo-50 font-semibold" : ""
                        }`}
                      >
                        <td className="py-2 px-4">{res.date}</td>
                        <td className="py-2 px-4 text-green-600">{res.first}</td>
                        <td className="py-2 px-4 text-yellow-600">{res.second}</td>
                        <td className="py-2 px-4 text-red-600">{res.third}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
