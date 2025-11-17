import TeerResults from './components/TeerResults'
import AIPredictionButton from './components/AIPredictionButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Shillong Teer Results
        </h1>
        <p className="text-gray-600 mt-2">
          Official Daily Results • Professional Service
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Main Results Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <TeerResults />
        </div>

        {/* AI Prediction Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Advanced Analytics</h2>
            <p className="text-gray-600 text-sm mt-1">
              Professional prediction tools for serious players
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <AIPredictionButton />
          </div>
        </div>

        {/* Extended History Card (Collapsible) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
              <span>Extended Result History</span>
              <span className="text-sm text-blue-600 font-normal">Click to expand</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4 text-center">
              {/* Sample extended history - you can connect this to your API */}
              {Array.from({ length: 15 }).map((_, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">15/11</div>
                  <div className="text-sm font-semibold text-gray-800">55</div>
                  <div className="text-sm font-semibold text-gray-800">78</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                Load More History →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-4">
          <p>Professional Teer Results Service • Data sourced from official providers</p>
          <p className="mt-1">© 2024 Teer Results Pro • All rights reserved</p>
        </div>
      </div>
    </div>
  )
}
