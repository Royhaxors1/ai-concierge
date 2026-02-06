// Inngest Client Configuration
import { Inngest } from 'inngest';
import { sendReminder } from '@/inngest/functions/reminders';

// Create Inngest client
export const inngest = new Inngest({
  eventKey: process.env.INNGEST_EVENT_KEY,
});

// Register functions
export const functions = [sendReminder];

// Inngest handler for Next.js App Router
export const serve = (await import('inngest/next')).serve;

// Helper to check if Inngest is configured
export const isInngestConfigured = () => 
  !!process.env.INNGEST_EVENT_KEY;
