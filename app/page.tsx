import TeerResults from './components/TeerResults'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            🎯 TEER RESULTS PRO
          </h1>
          <p className="text-lg text-gray-600">
            Live Results • Professional Service • Daily Updates
          </p>
        </div>

        {/* Main Results */}
        <TeerResults />

        {/* AI Prediction Button */}
        <div className="max-w-md mx-auto mt-8 text-center">
          <button 
            onClick={() => alert('AI Analytics & Predictions available to premium users')}
            className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold text-lg w-full shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🔮</span>
              <span>AI Analytics & Predictions</span>
            </div>
            <div className="text-sm opacity-90 mt-1">Premium Feature - Upgrade to Access</div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Professional teer results service • Data sourced from official providers</p>
          <p className="mt-1">Auto-updated daily • Shillong results</p>
        </div>
      </div>
    </main>
  )
}
