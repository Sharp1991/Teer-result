import '../styles/globals.css'; // <-- Add this line to import Tailwind

export const metadata = {
  title: "Teer Results",
  description: "Scraped Shillong Teer Results",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="font-sans p-5"> {/* Tailwind classes instead of inline styles */}
        {children}
      </body>
    </html>
  );
}
