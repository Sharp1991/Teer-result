import type { Metadata } from 'next'
import TeerResults from '../../components/TeerResults'

export const metadata: Metadata = {
  title: 'শিলং তীর পূর্ববর্তী ফলাফল | ইতিহাস',
  description:
    'তারিখ অনুযায়ী শিলং তীরের পূর্ববর্তী ফলাফল দেখুন। প্রথম রাউন্ড এবং দ্বিতীয় রাউন্ডের ফলাফল।',
  alternates: {
    canonical: '/bn/history',
    languages: {
      en: '/history',
      bn: '/bn/history',
      'x-default': '/history',
    },
  },
  openGraph: {
    title: 'শিলং তীর পূর্ববর্তী ফলাফল',
    description:
      'তারিখ অনুযায়ী শিলং তীরের পূর্ববর্তী ফলাফল দেখুন।',
    url: 'https://www.shillongteerresults.co.in/bn/history',
    siteName: 'Shillong Teer Results',
    type: 'website',
    locale: 'bn_IN',
  },
}

export default function BengaliHistoryPage() {
  return <TeerResults language="bn" initialTab="history" />
}
