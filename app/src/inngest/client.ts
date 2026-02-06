// Inngest Client Configuration
import { Inngest } from 'inngest';
import { sendReminder } from '@/inngest/functions/reminders';

// Create Inngest client - works even without keys (will just not send)
export const inngest = new Inngest({
  name: 'AI Concierge',
  eventKey: process.env.INNGEST_EVENT_KEY || 'dummy-key',
  signingKey: process.env.INNGEST_SIGNING_KEY || 'dummy-secret',
});

// Register functions
export const functions = [sendReminder];

// Inngest handler for Next.js App Router
export const serve = (await import('inngest/next')).serve;

// Helper to check if Inngest is configured
export const isInngestConfigured = () => 
  !!process.env.INNGEST_EVENT_KEY && !!process.env.INNGEST_SIGNING_KEY;
