import TeerResults from './components/TeerResults'
import { getHomeResults } from '../lib/get-home-results'

const siteUrl = 'https://www.shillongteerresults.co.in'

export default async function Home() {
  const initialResults = await getHomeResults()
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Teer Khobor',
        description:
          'Shillong Teer results, previous results, and Teer statistics.',
        inLanguage: 'en-IN',
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: 'Teer Khobor | Shillong Teer Results Today',
        description:
          'Check Shillong Teer First Round and Second Round results, previous results, and statistics.',
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        inLanguage: 'en-IN',
      },
    ],
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-0 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4">
        <TeerResults initialResults={initialResults} />
      </div>
    </main>
  )
}
