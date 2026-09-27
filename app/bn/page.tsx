import type { Metadata } from 'next'
import TeerResults from '../components/TeerResults'

export const metadata: Metadata = {
  title: {
    default: 'শিলং তীর ফলাফল আজ | প্রথম ও দ্বিতীয় রাউন্ড',
    template: '%s',
  },
  description:
    'আজকের শিলং তীর ফলাফল দেখুন। প্রথম ও দ্বিতীয় রাউন্ডের ফলাফল, পূর্ববর্তী ফলাফল এবং তীর পরিসংখ্যান একসাথে দেখুন।',
  alternates: {
    canonical: '/bn',
    languages: {
      en: '/',
      bn: '/bn',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'শিলং তীর ফলাফল আজ',
    description:
      'আজকের শিলং তীর ফলাফল, প্রথম ও দ্বিতীয় রাউন্ডের নম্বর, পূর্ববর্তী ফলাফল এবং তীর পরিসংখ্যান।',
    url: 'https://www.shillongteerresults.co.in/bn',
    siteName: 'Shillong Teer Results',
    type: 'website',
    locale: 'bn_IN',
  },
}

export default function BengaliPage() {
  return <TeerResults language="bn" />
}
