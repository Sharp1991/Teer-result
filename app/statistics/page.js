import TeerStatistics from '../components/TeerStatistics'
import Head from 'next/head'

export default function StatisticsPage() {
  return (
    <>
      <Head>
        <title>Teer Statistics & Analytics | Detailed Number Patterns</title>
        <meta name="description" content="Comprehensive Teer statistics, hot numbers, due numbers, and pattern analysis based on historical data." />
      </Head>

      <div className="min-h-screen bg-gray-50 py-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-8 mb-6">
          <div className="max-w-md mx-auto text-center px-4">
            <h1 className="text-2xl font-bold mb-2">📊 Teer Statistics</h1>
            <p className="text-blue-100 text-base">Detailed analytics for both rounds</p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4">
          <TeerStatistics />
        </div>
      </div>
    </>
  )
}
