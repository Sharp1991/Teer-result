export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl p-8 shadow-xl">

        {/* Hero */}
        <div className="text-center mb-10 pb-8 border-b border-gray-700">
          <span className="text-5xl block mb-3">🎯</span>
          <h1 className="text-3xl font-bold text-amber-400 mb-2">About Us</h1>
          <p className="text-gray-400">Your trusted source for Shillong Teer Results</p>
        </div>

        <Section title="Who We Are">
          <p>
            Welcome to <strong>Shillong Teer Results</strong> — one of the most reliable and
            up-to-date platforms for daily Teer results, predictions, and analytics. We are a
            dedicated team who built this platform to give Teer players and followers a simple,
            fast, and accurate source of results every day.
          </p>
        </Section>

        <Section title="What We Do">
          <ul className="space-y-2">
            <li>🎯 <strong>Live Daily Results</strong> — First and Second Round results updated daily</li>
            <li>📊 <strong>Historical Data</strong> — Browse past results going back months</li>
            <li>🔮 <strong>Analytics & Predictions</strong> — AI-powered common number analysis</li>
            <li>📈 <strong>Statistics</strong> — Hot numbers, due numbers, frequency charts</li>
          </ul>
        </Section>

        <Section title="Our Mission">
          <p>
            Our mission is simple: <strong>make Teer results accessible to everyone.</strong> Whether
            you are checking results from Shillong, Juwai, or Khanapara, we aim to be your
            go-to platform — fast, accurate, and easy to use on any device.
          </p>
        </Section>

        <Section title="Why Trust Us?">
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { icon: "✅", title: "Accurate", desc: "Sourced from official Teer counters" },
              { icon: "⚡", title: "Fast", desc: "Updated within minutes of announcement" },
              { icon: "📱", title: "Mobile Friendly", desc: "Works on all devices" },
              { icon: "🆓", title: "Free", desc: "Always free to access daily results" },
            ].map((card) => (
              <div key={card.title} className="bg-gray-800 rounded-xl p-4 text-center">
                <span className="text-2xl block mb-1">{card.icon}</span>
                <strong className="text-amber-400 text-sm block mb-1">{card.title}</strong>
                <p className="text-gray-400 text-xs">{card.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Contact Us">
          <div className="bg-gray-800 rounded-xl p-4 space-y-1">
            <p>📧 <strong>Email:</strong> contact@shillongteerresults.co.in</p>
            <p>🌐 <strong>Website:</strong> shillongteerresults.co.in</p>
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">
            We typically respond within 24–48 hours.
          </p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-amber-400 border-b border-gray-700 pb-2 mb-3">
        {title}
      </h2>
      <div className="text-gray-300 leading-relaxed text-sm space-y-2">{children}</div>
    </div>
  );
}
