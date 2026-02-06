// Inngest API Route for Next.js
import { serve, inngest, functions, isInngestConfigured } from '@/inngest/client';

// Create serve handler or dummy handlers
const createHandler = () => {
  if (isInngestConfigured() && serve && inngest && functions) {
    return serve({
      client: inngest,
      functions,
    });
  }
  // Return dummy handlers when Inngest is not configured
  return {
    GET: () => new Response('Inngest not configured', { status: 200 }),
    POST: () => new Response('Inngest not configured', { status: 200 }),
  };
};

export const { GET, POST } = createHandler();
