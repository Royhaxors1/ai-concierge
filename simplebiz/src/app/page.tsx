import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 text-6xl">🤖</div>
        
        {/* Heading */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          AI Concierge
        </h1>
        
        {/* Subheading */}
        <p className="mb-8 text-xl text-gray-600">
          Focus on your work. AI handles the scheduling, reminders, and customer questions.
        </p>
        
        {/* Value Props */}
        <div className="mb-8 grid gap-4 text-left">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            📅 <strong>24/7 Booking</strong> — Customers can book anytime, not just business hours
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            🔔 <strong>Automated Reminders</strong> — Never miss an appointment again
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            💬 <strong>Natural Conversation</strong> — AI that understands customers
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            📱 <strong>WhatsApp Native</strong> — Works where your customers already are
          </div>
        </div>
        
        {/* CTA */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Open Dashboard →
          </Link>
          <Link
            href="https://github.com/Royhaxors1/ai-concierge"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100"
          >
            View on GitHub
          </Link>
        </div>
        
        {/* Footer */}
        <p className="mt-12 text-sm text-gray-500">
          Built with Next.js + Minimax-M2.1 + OpenClaw
        </p>
      </div>
    </main>
  );
}
