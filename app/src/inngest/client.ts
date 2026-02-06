// Inngest Client Configuration
import { Inngest } from 'inngest';
import { sendReminder } from '@/inngest/functions/reminders';

// Create Inngest client - v3 API uses 'id' not 'eventKey'
export const inngest = new Inngest({
  id: 'ai-concierge',
});

// Register functions
export const functions = [sendReminder];

// Inngest handler for Next.js App Router
export const serve = (await import('inngest/next')).serve;

// Helper to check if Inngest is configured with real keys
export const isInngestConfigured = () => 
  !!process.env.INNGEST_EVENT_KEY && !!process.env.INNGEST_SIGNING_KEY;
