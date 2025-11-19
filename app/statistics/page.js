import TeerStatistics from '../components/TeerStatistics'
import Head from 'next/head'

export default function StatisticsPage() {
  return (
    <>
      <Head>
        <title>Teer Statistics & Analytics | Detailed Number Patterns</title>
        <meta name="description" content="Comprehensive Teer statistics, hot numbers, due numbers, and pattern analysis based on historical data." />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12 mb-8 rounded-b-3xl shadow-xl">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl font-bold mb-4">📊 Teer Statistics</h1>
            <p className="text-blue-100 text-lg">Detailed analytics and number patterns</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <TeerStatistics />
        </div>
      </div>
    </>
  )
}
