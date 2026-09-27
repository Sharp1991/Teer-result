import DreamNumberClient from "./DreamNumberClient";

export const metadata = {
  title: "তীর স্বপ্নের নম্বর চার্ট | স্বপ্ন থেকে নম্বর খুঁজুন",
  description:
    "স্বপ্নের অর্থ ও ঐতিহ্যবাহী তীর স্বপ্নের নম্বর খুঁজুন। সাপ, টাকা, পশু, বিয়ে, মৃত্যু, প্রকৃতি, শিক্ষা এবং আরও অনেক স্বপ্নের নম্বর অনুসন্ধান করুন।",
  alternates: {
    canonical: "/bn/dream-number",
    languages: {
      en: "/dream-number",
      bn: "/bn/dream-number",
      "x-default": "/dream-number",
    },
  },
  openGraph: {
    title: "তীর স্বপ্নের নম্বর চার্ট",
    description:
      "আপনার স্বপ্ন অনুসন্ধান করে ঐতিহ্যবাহী তীর স্বপ্নের নম্বরের সঙ্গে মিল খুঁজে নিন।",
    url: "https://www.shillongteerresults.co.in/bn/dream-number",
    siteName: "Shillong Teer Results",
    type: "website",
    locale: "bn_IN",
  },
};

export default function Page() {
  return <DreamNumberClient />;
}
