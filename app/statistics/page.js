import TeerStatistics from '../components/TeerStatistics'

export const metadata = {
  title: 'Shillong Teer Analytics & Statistics | Number Frequency',
  description:
    'Explore Shillong Teer statistics, historical number frequency, hot numbers, missing numbers, and round-by-round analysis.',
  alternates: {
    canonical: '/statistics',
  },
  openGraph: {
    title: 'Shillong Teer Analytics & Statistics | Number Frequency',
    description:
      'Explore Shillong Teer statistics, historical number frequency, hot numbers, missing numbers, and round-by-round analysis.',
    url: '/statistics',
    siteName: 'Shillong Teer Results',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-8 mb-6">
        <div className="max-w-md mx-auto text-center px-4">
          <h1 className="text-2xl font-bold mb-2">📊 Teer Statistics</h1>
          <p className="text-blue-100 text-base">
            Detailed analytics for both rounds
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        <TeerStatistics />
      </div>
    </div>
  )
}
