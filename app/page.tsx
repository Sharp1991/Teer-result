import TeerResults from './components/TeerResults'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            🎯 Teer Results
          </h1>
          <p className="text-center text-gray-600 mb-2">
            Live results sourced directly from teertooday.com
          </p>
          <p className="text-center text-sm text-gray-500">
            No mock data • Real-time scraping • Automatic updates
          </p>
        </div>
        <TeerResults />
      </div>
    </main>
  )
}
