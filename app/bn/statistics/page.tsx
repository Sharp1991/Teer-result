import type { Metadata } from 'next'
import SiteNavbar from '../../components/SiteNavbar';
import TeerStatistics from '../../components/TeerStatistics'

export const metadata: Metadata = {
  title: 'শিলং তীর পরিসংখ্যান ও বিশ্লেষণ',
  description:
    'শিলং তীরের নম্বর পরিসংখ্যান, হট নম্বর, দীর্ঘদিন না আসা নম্বর এবং রাউন্ড অনুযায়ী বিশ্লেষণ দেখুন।',
  alternates: {
    canonical: '/bn/statistics',
    languages: {
      en: '/statistics',
      bn: '/bn/statistics',
      'x-default': '/statistics',
    },
  },
  openGraph: {
    title: 'শিলং তীর পরিসংখ্যান ও বিশ্লেষণ',
    description:
      'শিলং তীরের নম্বর পরিসংখ্যান, হট নম্বর এবং ঐতিহাসিক বিশ্লেষণ দেখুন।',
    url: 'https://www.shillongteerresults.co.in/bn/statistics',
    siteName: 'Shillong Teer Results',
    type: 'website',
    locale: 'bn_IN',
  },
}

export default function BengaliStatisticsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-0 pb-8">
      <div className="mx-auto max-w-6xl px-4">
        <SiteNavbar language="bn" activePage="statistics" />

        <div className="mt-4 flex justify-end">
          <a
            href="/statistics"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            English
          </a>
        </div>

        <section className="mt-6 rounded-3xl bg-slate-900 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-medium text-slate-400">
            শিলং তীর ডেটা সেন্টার
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            📊 তীর পরিসংখ্যান
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            সংরক্ষিত শিলং তীর ফলাফলের ভিত্তিতে নম্বরের ফ্রিকোয়েন্সি, গ্যাপ এবং
            রাউন্ড অনুযায়ী পরিসংখ্যান দেখুন।
          </p>
        </section>

        <div className="mt-6">
          <TeerStatistics language="bn" />
        </div>
      </div>
    </main>
  )
}
