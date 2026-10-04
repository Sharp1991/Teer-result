import type { Metadata } from 'next'
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
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="sticky top-0 z-10 -mx-4 border-b border-slate-800 bg-slate-950 px-4 py-3 shadow-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <a href="/bn" className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Shillong
              </p>
              <p className="mt-0.5 text-sm font-black tracking-tight text-white">
                TEER RESULTS
              </p>
            </a>

            <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-inner">
              <a
                href="/bn"
                className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
              >
                ফলাফল
              </a>
              <a
                href="/bn/statistics"
                className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-950 shadow-sm"
              >
                পরিসংখ্যান
              </a>
              <a
                href="/bn/history"
                className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
              >
                ইতিহাস
              </a>              <a
                href="/bn/dream-number"
                className="rounded-lg px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
              >
                ড্রিম নম্বর
              </a>
            </div>
          </div>
        </nav>

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
