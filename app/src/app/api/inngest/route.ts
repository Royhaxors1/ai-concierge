// Inngest API Route for Next.js
import { serve, inngest, functions, isInngestConfigured } from '@/inngest/client';

// Export serve handler for Next.js
// If Inngest is configured, use real handlers. Otherwise return dummy.
const handlerOptions = isInngestConfigured()
  ? serve({ client: inngest, functions })
  : {
      GET: () => new Response('Inngest not configured', { status: 200 }),
      POST: () => new Response('Inngest not configured', { status: 200 }),
    };

export const { GET, POST } = handlerOptions;
