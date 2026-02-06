// Inngest Client Configuration
// Only initialize if environment variables are present
import { Inngest } from 'inngest';
import { sendReminder } from '@/inngest/functions/reminders';

// Create Inngest client only if keys are present
const hasInngestKeys = process.env.INNGEST_EVENT_KEY && process.env.INNGEST_SIGNING_KEY;

export const inngest = hasInngestKeys
  ? new Inngest({
      name: 'AI Concierge',
      eventKey: process.env.INNGEST_EVENT_KEY!,
      signingKey: process.env.INNGEST_SIGNING_KEY!,
    })
  : null;

// Register functions
export const functions = hasInngestKeys
  ? [sendReminder]
  : [];

// Inngest handler for Next.js App Router
export const serve = hasInngestKeys
  ? (await import('inngest/next')).serve
  : null;

// Helper to check if Inngest is configured
export const isInngestConfigured = () => hasInngestKeys;
