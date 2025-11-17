import TeerResults from "./components/TeerResults";
import AIPredictionButton from "./components/AIPredictionButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-10 shadow-md">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-3 tracking-wide">
            Shillong Teer Results
          </h1>
          <p className="text-blue-100 text-lg">
            Official Results • Daily Updates • Auto Refreshed
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-4xl py-10 space-y-10">

        {/* LIVE INDICATORS */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span>Live Results</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span>Historical Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            <span>Trusted Service</span>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Today’s Teer Results
          </h2>
          <TeerResults />
        </div>

        {/* AI SECTION */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Advanced Teer Analytics
            </h2>
            <p className="text-gray-500 text-sm">
              Premium AI-powered predictions & number analysis
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <AIPredictionButton />
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center text-gray-600 pt-6 pb-10">
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 max-w-lg mx-auto">
            <p className="font-medium">Shillong Teer Results Service</p>
            <div className="flex justify-center space-x-4 text-xs mt-2 text-gray-500">
              <span>Data Source: teertooday.com</span>
              <span>•</span>
              <span>Updated Daily</span>
              <span>•</span>
              <span>Fast & Accurate</span>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
