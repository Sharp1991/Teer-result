import TeerResults from './components/TeerResults'
import AIPredictionButton from './components/AIPredictionButton'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Teer Results Service
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              Official Shillong Teer Results • Daily Updates
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Live Results
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Historical Data
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Professional Service
              </div>
            </div>
          </div>
        </div>

        {/* Main Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <TeerResults />
        </div>

        {/* Professional AI Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Advanced Analytics
            </h2>
            <p className="text-gray-600">
              Premium features for professional analysis
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <AIPredictionButton />
          </div>
        </div>

        {/* Professional Footer */}
        <div className="text-center text-gray-500 text-sm">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="mb-2">Professional Teer Results Service</p>
            <div className="flex justify-center space-x-6 text-xs">
              <span>Data Source: teertooday.com</span>
              <span>•</span>
              <span>Auto-updated Daily</span>
              <span>•</span>
              <span>Shillong Results</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
