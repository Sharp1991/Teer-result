import TeerResults from './components/TeerResults'
import AIPredictionButton from './components/AIPredictionButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header with Blue Accent */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 mb-8 rounded-b-3xl shadow-lg">
        <div className="max-w-2xl mx-auto text-center px-4">
          {/* Graphic Elements */}
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-40"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Shillong Teer Results
          </h1>
          <p className="text-blue-100 text-lg opacity-90">
            Official Daily Results • Professional Service
          </p>
          
          {/* Bottom Graphic */}
          <div className="mt-6 flex justify-center">
            <div className="w-20 h-1 bg-white opacity-30 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 px-4">
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

        {/* Extended History Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-4 bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="text-blue-600 mr-2">📊</span>
              Extended Result History
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 text-sm">
              <p>Comprehensive historical data available</p>
              <p className="mt-1">Access full result archives and analytics</p>
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
