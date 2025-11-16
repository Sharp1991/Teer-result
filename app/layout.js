export const metadata = { title: "Teer Results", description: "Scraped Shillong Teer Results" };
export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 20 }}>
        {children}
      </body>
    </html>
  );
}