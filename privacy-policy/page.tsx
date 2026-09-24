export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-amber-400 mb-1">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: May 2025</p>

        <p className="text-gray-300 leading-relaxed border-l-4 border-amber-400 pl-4 mb-8">
          Welcome to <strong>Shillong Teer Results</strong> (shillongteerresults.co.in).
          Your privacy is important to us. This Privacy Policy explains how we collect,
          use, and protect your information when you visit our website.
        </p>

        <Section title="1. Information We Collect">
          <p>We may collect the following types of information:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, device info, and IP address.</li>
            <li><strong>Cookies:</strong> Small files stored on your device to improve experience and serve ads.</li>
            <li><strong>Voluntary Information:</strong> Name or email if you contact us directly.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc list-inside space-y-1">
            <li>To display daily Teer results and related content</li>
            <li>To improve website performance and user experience</li>
            <li>To show relevant advertisements via Google AdSense</li>
            <li>To analyze traffic using Google Analytics</li>
            <li>To respond to inquiries or feedback</li>
          </ul>
        </Section>

        <Section title="3. Google AdSense & Advertising">
          <p>
            We use <strong>Google AdSense</strong> to display advertisements. Google may use cookies
            to serve ads based on your prior visits to our site or other websites. You can opt out at{" "}
            <a href="https://www.google.com/settings/ads" className="text-amber-400 underline">
              Google Ads Settings
            </a>.
          </p>
        </Section>

        <Section title="4. Cookies">
          <p>We use the following types of cookies:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the site to function.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand visitor behavior.</li>
            <li><strong>Advertising Cookies:</strong> Used by Google AdSense for relevant ads.</li>
          </ul>
          <p className="mt-2">You can disable cookies through your browser settings at any time.</p>
        </Section>

        <Section title="5. Third-Party Links">
          <p>
            Our site may contain links to third-party websites. We are not responsible for their
            privacy practices. We encourage you to read their privacy policies.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We take reasonable precautions to protect your information. However, no method of
            internet transmission is 100% secure.
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            Our website is not directed at children under 13. We do not knowingly collect
            personal data from children.
          </p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this policy from time to time. Changes will be posted on this page
            with an updated date.
          </p>
        </Section>

        <Section title="9. Contact Us">
          <div className="bg-gray-800 rounded-xl p-4 mt-2">
            <p>📧 <strong>Email:</strong> contact@shillongteerresults.co.in</p>
            <p>🌐 <strong>Website:</strong> shillongteerresults.co.in</p>
          </div>
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
