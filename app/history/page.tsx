import TeerResults from '../components/TeerResults';

export const metadata = {
  title: 'Shillong Teer Previous Results | History',
  description:
    'View Shillong Teer previous results, including First Round and Second Round results by date.',
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
