import DreamNumberClient from "./DreamNumberClient";

export const metadata = {
  title: "Teer Dream Number Chart – Dream to Number Finder",
  description:
    "Search traditional Teer dream-number associations for dreams about snakes, money, animals, marriage, death, nature, education and more.",
  alternates: {
    canonical: "/dream-number",
  },
};

export default function Page() {
  return <DreamNumberClient />;
}
