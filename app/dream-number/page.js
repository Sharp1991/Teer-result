import DreamNumberClient from "./DreamNumberClient";

export const metadata = {
  title: "Teer Dream Number Chart – Dream to Number Finder",
  description:
    "Search traditional Teer dream-number associations for dreams about snakes, money, animals, marriage, death, nature, education and more.",
  alternates: {
    canonical: "/dream-number",
    languages: {
      en: "/dream-number",
      bn: "/bn/dream-number",
      "x-default": "/dream-number",
    },
  },
  openGraph: {
    title: "Teer Dream Number Chart – Dream to Number Finder",
    description:
      "Search traditional Teer dream-number associations for dreams about snakes, money, animals, marriage, death, nature, education and more.",
    url: "https://www.shillongteerresults.co.in/dream-number",
    siteName: "Shillong Teer Results",
    type: "website",
    locale: "en_IN",
  },
};

export default function Page() {
  return <DreamNumberClient />;
}
