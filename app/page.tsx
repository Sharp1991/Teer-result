import TeerResults from './components/TeerResults'
import AIPredictionButton from './components/AIPredictionButton'
import TeerStatistics from './components/TeerStatistics'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      {/* SEO Optimization */}
      <Head>
        <title>Shillong Teer Results Today | Official Daily Results & Predictions</title>
        <meta name="description" content="Get official Shillong Teer results updated daily. Live results, historical data, and professional analytics. Most accurate teer results service." />
        <meta name="keywords" content="shillong teer, teer results, teer today, teer prediction, shillong teer result" />
        <meta property="og:title" content="Shillong Teer Results - Official Daily Updates" />
        <meta property="og:description" content="Live Shillong Teer results with professional analytics and predictions" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://teer-results.com" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        {/* Professional Header with Archery Graphics */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-16 mb-8 rounded-b-3xl shadow-xl relative overflow-hidden">
          {/* Archery Target Graphic */}
          <div className="absolute top-4 right-8 opacity-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white rounded-full"></div>
              <div className="w-10 h-10 border-4 border-white rounded-full absolute top-3 left-3"></div>
              <div className="w-6 h-6 border-4 border-white rounded-full absolute top-5 left-5"></div>
              <div className="w-2 h-2 bg-white rounded-full absolute top-7 left-7"></div>
            </div>
          </div>
          
          {/* Arrow Graphic */}
          <div className="absolute top-12 left-8 opacity-20 transform -rotate-45">
            <div className="w-12 h-1 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white transform rotate-45 absolute -right-1 -top-1"></div>
          </div>

          <div className="max-w-2xl mx-auto text-center px-4 relative z-10">
            {/* Archery Dots */}
            <div className="flex justify-center space-x-3 mb-6">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              🎯 Shillong Teer Results
            </h1>
            <p className="text-blue-100 text-lg opacity-90 mb-2">
              Official Daily Results • Professional Analytics
            </p>
            <p className="text-blue-200 text-sm">
              Most Accurate • Live Updates • Historical Data
            </p>
            
            {/* Bottom Target Line */}
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-yellow-400 opacity-60 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6 px-4">
          {/* Top Ad Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-xs text-gray-500 mb-2">Advertisement</div>
            <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Ad Space - 728x90</span>
            </div>
          </div>

          {/* Main Results Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <TeerResults />
          </div>

          {/* Middle Ad Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-xs text-gray-500 mb-2">Sponsored</div>
            <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Ad Space - 300x250</span>
            </div>
          </div>

          {/* AI Prediction Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Advanced Analytics</h2>
              <p className="text-gray-600 text-sm mt-1">
                Professional prediction tools with AI-powered insights
              </p>
            </div>
            <div className="max-w-sm mx-auto">
              <AIPredictionButton />
            </div>
          </div>

          {/* Statistics Card */}
          <TeerStatistics />

          {/* Extended History Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="text-blue-600 mr-2">📊</span>
                Extended Result History
              </h3>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500 text-sm">
                <p>Access comprehensive historical data and analytics</p>
                <p className="mt-1">Full archives with professional insights</p>
              </div>
            </div>
          </div>

          {/* Bottom Ad Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-xs text-gray-500 mb-2">Advertisement</div>
            <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Ad Space - 728x90</span>
            </div>
          </div>

          {/* Professional Footer */}
          <div className="text-center text-xs text-gray-500 py-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="font-medium text-gray-700 mb-2">Professional Teer Results Service</p>
              <p className="mb-1">Data sourced from official providers • Auto-updated daily</p>
              <p>© 2024 Teer Results Pro • All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
