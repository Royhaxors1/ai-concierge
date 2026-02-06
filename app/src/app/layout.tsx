import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Concierge - Booking Assistant",
  description: "AI-powered booking concierge for local service businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
