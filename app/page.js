import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teer Result Meghalaya</h1>
          <nav>
            <a href="/" className="px-3 hover:underline">Home</a>
            <a href="/results" className="px-3 hover:underline">Results</a>
            <a href="/about" className="px-3 hover:underline">About</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow bg-green-50 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Get the Latest Teer Results Instantly</h2>
          <p className="text-gray-700 text-lg mb-6">
            Check today’s results, previous draws, and stats in one place.
          </p>
          <a href="/results" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            View Results
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 p-4 mt-10">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Teer Result Meghalaya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
