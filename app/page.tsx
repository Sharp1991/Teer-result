// app/page.tsx
import React from "react";

type Result = {
  first: string;
  second: string;
  // third removed
};

// If you're fetching props inside, use a function or fetch directly
// For now, let's assume a placeholder
const todayResult: Result = {
  first: "123",
  second: "456",
};

export default function Page() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Today's Teer Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Round */}
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="font-medium">First Round</p>
            <p className="text-xl font-bold text-green-600">{todayResult.first}</p>
          </div>

          {/* Second Round */}
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="font-medium">Second Round</p>
            <p className="text-xl font-bold text-blue-600">{todayResult.second}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
