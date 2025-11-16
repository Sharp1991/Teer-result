import '../styles/globals.css';

export const metadata = {
  title: "Teer Results",
  description: "Scraped Shillong Teer Results",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="font-sans p-5">
        {children}
      </body>
    </html>
  );
}
