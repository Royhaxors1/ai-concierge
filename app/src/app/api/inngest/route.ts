// Inngest API Route for Next.js
import { serve } from 'inngest/next';
import { inngest, functions } from '@/inngest/client';

// Export serve handler for Next.js
export const { GET, POST } = serve({
  client: inngest,
  functions,
});
