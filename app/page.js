"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData(){
      try {
        const res = await fetch("/api/scrape");
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main>
      <h1>Shillong Teer Results</h1>
      {loading && <p>Loading results…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {data && (
        <section>
          <p><strong>Date:</strong> {data.date ?? "N/A"}</p>
          <p><strong>Location:</strong> {data.location ?? "SHILLONG"}</p>
          <p><strong>First Result:</strong> {data.first ?? "-"}</p>
          <p><strong>Second Result:</strong> {data.second ?? "-"}</p>
          <pre style={{ background: "#f7f7f7", padding: 10 }}>{JSON.stringify(data, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}