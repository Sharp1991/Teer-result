import TeerResults from '../components/TeerResults';

export const metadata = {
  title: 'Shillong Teer Previous Results | Historical Results',
  description:
    'View Shillong Teer previous results by date, including Shillong Teer First Round and Second Round results and historical results.',
  alternates: {
    canonical: '/history',
    languages: {
      en: '/history',
      bn: '/bn/history',
      'x-default': '/history',
    },
  },
  openGraph: {
    title: 'Shillong Teer Previous Results | Historical Results',
    description:
      'View Shillong Teer previous results by date, including First Round and Second Round historical results.',
    url: 'https://www.shillongteerresults.co.in/history',
    siteName: 'Shillong Teer Results',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <TeerResults initialTab="history" />
      </div>
    </main>
  );
}
