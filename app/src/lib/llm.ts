// LLM Integration - Minimax-M2.1 via OpenClaw Gateway
// Handles intent classification, entity extraction, and response generation

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface BookingIntent {
  intent: 'book' | 'inquire' | 'cancel' | 'reschedule' | 'faq' | 'other';
  confidence: number;
  entities: {
    service?: string;
    date?: string;
    time?: string;
    duration?: number;
    guests?: number;
  };
  rawText: string;
}

export interface LLMResponse {
  message: string;
  action?: 'book' | 'confirm' | 'show_slots' | 'transfer' | 'faq';
  entities?: BookingIntent['entities'];
  shouldConfirm?: boolean;
}

// System prompt for the concierge
const SYSTEM_PROMPT = `You are a helpful booking assistant for local service businesses (salons, tutors, consultants).

Your role:
- Help customers book appointments naturally
- Answer questions about services, hours, pricing
- Be friendly, professional, concise
- Always confirm details before booking

Response style:
- Keep messages short and clear
- Use emojis sparingly
- Ask for clarification if needed
- For bookings: always confirm service, date, time

If you need availability, ask the user what times work for them. Do not invent slots.`;

// Detect intent from user message
export async function detectIntent(
  message: string,
  conversationHistory: LLMMessage[] = []
): Promise<BookingIntent> {
  const prompt = `${SYSTEM_PROMPT}

Analyze this message and extract:
1. Intent: book/inquire/cancel/reschedule/faq/other
2. Entities: service, date, time, duration, guests
3. Confidence: 0-1

Message: "${message}"

Respond with JSON:
{
  "intent": "...",
  "confidence": 0.0,
  "entities": {
    "service": "...",
    "date": "...",
    "time": "...",
    "duration": ...,
    "guests": ...
  },
  "rawText": "..."
}`;

  try {
    // Use OpenClaw's sessions_spawn or direct gateway call for Minimax
    const response = await fetch(`${process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3001'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'minimax/MiniMax-M2.1',
        messages: [
          { role: 'system', content: prompt },
          ...conversationHistory.slice(-5), // Last 5 messages for context
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Minimax API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback parsing
    return {
      intent: 'other',
      confidence: 0.5,
      entities: {},
      rawText: message,
    };
  } catch (error) {
    console.error('LLM intent detection error:', error);
    return {
      intent: 'other',
      confidence: 0.0,
      entities: {},
      rawText: message,
    };
  }
}

// Generate response message
export async function generateResponse(
  intent: BookingIntent,
  businessContext: {
    services: Array<{ name: string; durationMin: number; price?: number; description?: string }>;
    hours?: Record<string, string[]>;
    businessName: string;
  },
  conversationHistory: LLMMessage[] = []
): Promise<LLMResponse> {
  const serviceList = businessContext.services
    .map(s => `- ${s.name}: ${s.durationMin}min${s.price ? ` $${s.price}` : ''}`)
    .join('\n');

  const hoursInfo = businessContext.hours 
    ? Object.entries(businessContext.hours)
        .map(([day, slots]) => `${day}: ${slots.join(', ')}`)
        .join('\n')
    : 'Check with business for hours';

  const prompt = `${SYSTEM_PROMPT}

Current intent: ${intent.intent}
Entities: ${JSON.stringify(intent.entities)}

Business info:
Name: ${businessContext.businessName}
Services:
${serviceList}
Hours:
${hoursInfo}

Recent conversation:
${conversationHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

Respond appropriately to this intent. If booking, offer to show available slots.`;

  try {
    const response = await fetch(`${process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3001'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'minimax/MiniMax-M2.1',
        messages: [
          { role: 'system', content: prompt },
          ...conversationHistory.slice(-5),
          { role: 'user', content: intent.rawText },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Minimax API error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || 'I\'m not sure how to help with that.';

    return {
      message,
      action: intent.intent === 'book' ? 'show_slots' 
        : intent.intent === 'faq' ? 'faq'
        : undefined,
    };
  } catch (error) {
    console.error('LLM response error:', error);
    return {
      message: 'I\'m having trouble understanding. Could you rephrase that?',
      action: 'transfer',
    };
  }
}

// Extract date/time entities more reliably
export function parseDateTime(text: string): { date?: string; time?: string } {
  // Simple patterns - can be enhanced with a library like chrono-node
  const datePatterns = [
    /today/i,
    /tomorrow/i,
    /next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    /this\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    /(\d{1,2})\/(\d{1,2})/,
    /(\d{4})-(\d{2})-(\d{2})/,
  ];

  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(am|pm)?/i,
    /(\d{1,2})\s*(am|pm)/i,
    /morning/i,
    /afternoon/i,
    /evening/i,
    /noon/i,
  ];

  let date: string | undefined;
  let time: string | undefined;

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      date = match[0];
      break;
    }
  }

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      time = match[0];
      break;
    }
  }

  return { date, time };
}
