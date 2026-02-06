// Inngest Client Configuration
import { Inngest } from 'inngest';
import { sendReminder } from '@/inngest/functions/reminders';

// Create Inngest client
export const inngest = new Inngest({
  name: 'AI Concierge',
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

// Register functions
export const functions = [
  sendReminder,
];

// Inngest endpoint for Next.js
export { onRequest } from 'inngest(nextjs)';
