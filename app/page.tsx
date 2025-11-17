import TeerResults from './components/TeerResults'
import AIPredictionButton from './components/AIPredictionButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-md">
          Shillong Teer Results
        </h1>
        <p className="text-gray-600 mt-2 text-sm tracking-wide">
          Accurate • Fast • Daily Updated
        </p>
      </div>

      {/* Top Ad Placeholder */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-white shadow-md p-6 rounded-xl text-center text-sm text-gray-500 border border-blue-100">
          <p>Advertisement Space</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Results Component */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
          <TeerResults />
        </div>

        {/* AI Prediction Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">AI Prediction</h2>
            <p className="text-gray-600">
              Generate predictions using advanced Teer pattern analytics.
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <AIPredictionButton />
          </div>
        </div>

        {/* Bottom Ad Placeholder */}
        <div className="bg-white shadow-md p-6 rounded-xl text-center text-sm text-gray-500 border border-blue-100">
          <p>Advertisement Space</p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto mt-12 text-center text-xs text-gray-500">
        <p>Professional Teer Results Service • Data sourced from official providers</p>
        <p className="mt-1">Auto-updated daily • Shillong results only</p>
      </div>
    </div>
  )
}
