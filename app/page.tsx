import React from "react";

type Result = {
  date: string | null;
  location: string;
  first: string | null;
  second: string | null;
  source: string;
};

async function getTeerResults(): Promise<Result> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/scrape`);
  if (!res.ok) throw new Error("Failed to fetch Teer results");
  return res.json();
}

export default async function Page() {
  const todayResult = await getTeerResults();

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Today's Teer Results</h1>
      <p className="mb-2">Date: {todayResult.date || "N/A"}</p>
      <p className="mb-4">Location: {todayResult.location}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="font-medium">First Round</p>
          <p className="text-xl font-bold text-green-600">{todayResult.first || "-"}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="font-medium">Second Round</p>
          <p className="text-xl font-bold text-blue-600">{todayResult.second || "-"}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">Source: <a href={todayResult.source} target="_blank" rel="noopener noreferrer">{todayResult.source}</a></p>
    </main>
  );
}
