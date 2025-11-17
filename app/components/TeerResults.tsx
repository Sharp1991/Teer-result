"use client";

import { useEffect, useState } from "react";

interface Result {
  date: string | null;
  first: string | null;
  second: string | null;
  source: string;
}

export default function TeerResults() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch("/api/scrape");
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!result) return <p>No results found</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <p className="font-medium">Date: {result.date || "N/A"}</p>
      <p className="text-xl font-bold text-green-600">
        First: {result.first || "N/A"} | Second: {result.second || "N/A"}
      </p>
      <p className="text-sm text-gray-500">Source: {result.source}</p>
    </div>
  );
}
