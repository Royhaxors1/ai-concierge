import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl text-center">
        
        {/* Logo */}
        <div className="mb-8 text-7xl">🤖</div>
        
        {/* Heading */}
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
          AI Concierge
        </h1>
        
        {/* Subheading */}
        <p className="mb-8 text-xl text-gray-600">
          The 24/7 booking assistant that never sleeps. Built with Minimax-M2.1 + WhatsApp.
        </p>
        
        {/* Demo Conversation Preview */}
        <div className="mb-12 rounded-2xl bg-gray-900 p-6 text-left text-sm">
          <div className="mb-2 text-xs uppercase tracking-wider text-gray-400">
            💬 Demo Conversation
          </div>
          <div className="space-y-3 font-mono">
            <div className="rounded-lg bg-gray-800 p-3 text-gray-300">
              Customer: "Hi, I'd like to book a haircut for tomorrow"
            </div>
            <div className="rounded-lg bg-blue-600 p-3 text-white">
              AI: "I have 2pm and 4pm available tomorrow. Which works?"
            </div>
            <div className="rounded-lg bg-gray-800 p-3 text-gray-300">
              Customer: "2pm works"
            </div>
            <div className="rounded-lg bg-green-600 p-3 text-white">
              ✅ "Booked! You'll receive a reminder 24h and 1h before."
            </div>
          </div>
        </div>
        
        {/* Value Props */}
        <div className="mb-12 grid gap-4 text-left md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="mb-2 text-2xl">📅</div>
            <h3 className="mb-1 font-semibold">24/7 Booking</h3>
            <p className="text-sm text-gray-600">
              Customers book anytime, not just business hours
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="mb-2 text-2xl">🔔</div>
            <h3 className="mb-1 font-semibold">Auto Reminders</h3>
            <p className="text-sm text-gray-600">
              24h + 1h reminders via WhatsApp
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="mb-2 text-2xl">💬</div>
            <h3 className="mb-1 font-semibold">Natural Language</h3>
            <p className="text-sm text-gray-600">
              AI that understands context
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="mb-2 text-2xl">📱</div>
            <h3 className="mb-1 font-semibold">WhatsApp Native</h3>
            <p className="text-sm text-gray-600">
              Works where customers already are
            </p>
          </div>
        </div>
        
        {/* CTA */}
        <div className="flex flex-col gap-4 justify-center md:flex-row">
          <Link
            href="/dashboard"
            className="rounded-xl bg-black px-8 py-4 font-medium text-white hover:bg-gray-800 transition"
          >
            Open Dashboard →
          </Link>
          <a
            href="https://github.com/Royhaxors1/ai-concierge"
            className="rounded-xl border border-gray-300 px-8 py-4 font-medium hover:bg-gray-100 transition"
          >
            View on GitHub
          </a>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-200 pt-8">
          <div>
            <div className="text-3xl font-bold text-gray-900">$5-10K</div>
            <div className="text-sm text-gray-600">Per Client</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">5-10</div>
            <div className="text-sm text-gray-600">Clients/Month</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">$100K</div>
            <div className="text-sm text-gray-600">Monthly Goal</div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="mt-12 text-sm text-gray-500">
          Built with Next.js + Minimax-M2.1 + OpenClaw + Inngest
        </p>
      </div>
    </main>
  );
}
