import TeerResults from './components/TeerResults'

const siteUrl = 'https://www.shillongteerresults.co.in'

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Shillong Teer Results',
        description:
          'Shillong Teer results, previous results, and Teer statistics.',
        inLanguage: 'en-IN',
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: 'Shillong Teer Results Today',
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
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4">
        <TeerResults />
      </div>
    </main>
  )
}
