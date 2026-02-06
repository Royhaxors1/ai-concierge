// Inngest API Route for Next.js
import { serve, inngest, functions, isInngestConfigured } from '@/inngest/client';

// Export serve handler for Next.js
// Only export if Inngest is configured, otherwise export dummy handlers
if (isInngestConfigured() && serve && inngest && functions) {
  export const { GET, POST } = serve({
    client: inngest,
    functions,
  });
} else {
  // Dummy handlers when Inngest is not configured
  export async function GET() {
    return new Response('Inngest not configured', { status: 200 });
  }
  export async function POST() {
    return new Response('Inngest not configured', { status: 200 });
  }
}
