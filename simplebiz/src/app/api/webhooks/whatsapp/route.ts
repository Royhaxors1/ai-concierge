// WhatsApp Webhook Handler - OpenClaw Integration
// Receives incoming messages and routes them for processing

import { NextRequest, NextResponse } from 'next/server';
import { detectIntent, parseDateTime, LLMMessage } from '@/lib/llm';
import { prisma } from '@/lib/database';
import { addMinutes, addHours, format } from 'date-fns';

export interface WhatsAppMessage {
  id: string;
  from: string; // Customer phone
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'location';
  text?: { body: string };
  image?: { id: string; mime_type: string };
}

export interface WhatsAppWebhookPayload {
  messaging_product: 'whatsapp';
  contacts: Array<{ waid: string; profile: { name: string } }>;
  messages: WhatsAppMessage[];
}

// Send message back to WhatsApp via OpenClaw
export async function sendWhatsAppMessage(
  to: string,
  message: string,
  webhookUrl?: string
): Promise<boolean> {
  try {
    const url = webhookUrl || process.env.OPENCLAW_WEBHOOK_URL;
    
    if (!url) {
      console.error('No OpenClaw webhook URL configured');
      return false;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'text',
        to: to.replace(/^\+/, ''), // Remove + prefix
        text: { body: message },
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return false;
  }
}

// Process incoming message
async function processIncomingMessage(
  businessId: string,
  message: WhatsAppMessage
): Promise<void> {
  const customerPhone = message.from;
  const messageContent = message.text?.body || '';
  
  console.log(`Processing message from ${customerPhone}: ${messageContent}`);

  // Get or create customer
  const customer = await prisma.customer.upsert({
    where: {
      businessId_phone: {
        businessId,
        phone: customerPhone,
      },
    },
    update: {
      lastContactedAt: new Date(),
    },
    create: {
      businessId,
      phone: customerPhone,
    },
  });

  // Get conversation history
  const conversation = await prisma.conversation.findFirst({
    where: {
      businessId,
      sessionId: message.from,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const history: LLMMessage[] = conversation?.messages 
    ? (conversation.messages as LLMMessage[])
    : [];

  // Detect intent
  const intent = await detectIntent(messageContent, history);

  // Update/create conversation
  const newMessages: LLMMessage[] = [
    ...history,
    { role: 'user', content: messageContent },
  ];

  await prisma.conversation.upsert({
    where: {
      id: conversation?.id || 'new',
    },
    update: {
      messages: newMessages,
      intent: intent.intent,
      customerId: customer.id,
      updatedAt: new Date(),
    },
    create: {
      businessId,
      customerId: customer.id,
      sessionId: message.from,
      phone: customerPhone,
      messages: newMessages,
      intent: intent.intent,
    },
  });

  // Get business context
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { services: { where: { isActive: true } } },
  });

  if (!business) {
    await sendWhatsAppMessage(message.from, 'Sorry, something went wrong. Please try again.');
    return;
  }

  // Route based on intent
  let responseMessage = '';
  
  switch (intent.intent) {
    case 'book':
      responseMessage = await handleBookingIntent(businessId, intent, customer, business.services);
      break;
    case 'inquire':
      responseMessage = await handleInquiryIntent(businessId, intent, business.services, business);
      break;
    case 'cancel':
      responseMessage = await handleCancellationIntent(businessId, intent, customer);
      break;
    case 'faq':
      responseMessage = await handleFAQIntent(businessId, intent, business);
      break;
    default:
      responseMessage = await handleGenericIntent(messageContent, business, business.services);
  }

  // Send response
  await sendWhatsAppMessage(
    message.from,
    responseMessage,
    business.openClawWebhookUrl || undefined
  );
}

// Handle booking intent
async function handleBookingIntent(
  businessId: string,
  intent: ReturnType<typeof detectIntent> extends Promise<infer T> ? T : never,
  customer: { id: string; name?: string | null },
  services: Array<{ id: string; name: string; durationMin: number; price?: number | null }>
): Promise<string> {
  // If service is identified, ask for time
  if (intent.entities.service) {
    const service = services.find(s => 
      s.name.toLowerCase().includes(intent.entities.service?.toLowerCase() || '')
    );
    
    if (service) {
      return `Great! For a ${service.name} (${service.durationMin}min${service.price ? `, $${service.price}` : ''}), what time works for you?\n\nPlease let me know your preferred date and time.`;
    }
  }
  
  // Ask which service
  if (services.length === 1) {
    const service = services[0];
    return `I can help you book a ${service.name}. What time works for you?`;
  }
  
  const serviceList = services.map(s => `• ${s.name} (${s.durationMin}min${s.price ? ` - $${s.price}` : ''})`).join('\n');
  return `What service would you like to book?\n\n${serviceList}`;
}

// Handle inquiry intent
async function handleInquiryIntent(
  businessId: string,
  intent: ReturnType<typeof detectIntent> extends Promise<infer T> ? T : never,
  services: Array<{ id: string; name: string; description?: string | null; price?: number | null }>,
  business: { name: string; operatingHours?: Record<string, string[]> | null }
): Promise<string> {
  if (intent.entities.service) {
    const service = services.find(s => 
      s.name.toLowerCase().includes(intent.entities.service?.toLowerCase() || '')
    );
    
    if (service) {
      return `${service.name}${service.description ? `\n${service.description}` : ''}${service.price ? `\nPrice: $${service.price}` : ''}\n\nWould you like to book?`;
    }
  }
  
  return 'Could you tell me which service you\'re interested in?';
}

// Handle cancellation intent
async function handleCancellationIntent(
  businessId: string,
  intent: ReturnType<typeof detectIntent> extends Promise<infer T> ? T : never,
  customer: { id: string }
): Promise<string> {
  // Find upcoming appointments
  const appointment = await prisma.appointment.findFirst({
    where: {
      businessId,
      customerId: customer.id,
      startTime: { gte: new Date() },
      status: { in: ['pending', 'confirmed'] },
    },
    orderBy: { startTime: 'asc' },
    include: { service: true },
  });
  
  if (appointment) {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'cancelled' },
    });
    return `Your ${appointment.service.name} appointment on ${format(appointment.startTime, 'PPp')} has been cancelled.\n\nWould you like to rebook?`;
  }
  
  return 'I don\'t see an upcoming appointment to cancel. Would you like to book one?';
}

// Handle FAQ intent
async function handleFAQIntent(
  businessId: string,
  intent: ReturnType<typeof detectIntent> extends Promise<infer T> ? T : never,
  business: { name: string; operatingHours?: Record<string, string[]> | null }
): Promise<string> {
  const hours = business.operatingHours as Record<string, string[]> | undefined;
  
  if (hours) {
    const hourList = Object.entries(hours)
      .map(([day, slots]) => `${day}: ${slots.join(', ')}`)
      .join('\n');
    return `${hours ? `Our hours are:\n${hourList}` : 'Please check our website for hours.'}\n\nAnything else?`;
  }
  
  return 'Please contact us directly for hours and availability.';
}

// Handle generic intent
async function handleGenericIntent(
  message: string,
  business: { name: string },
  services: Array<{ name: string; durationMin: number; price?: number | null }>
): Promise<string> {
  if (services.length > 0) {
    const serviceNames = services.slice(0, 3).map(s => s.name).join(', ');
    return `I'm your booking assistant for ${business.name}. I can help you book ${serviceNames}${services.length > 3 ? ' and more' : ''}.\n\nWhat can I help you with?`;
  }
  
  return `Hi! I'm the booking assistant for ${business.name}. How can I help you today?`;
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const payload: WhatsAppWebhookPayload = await request.json();
    
    // Validate webhook
    if (payload.messaging_product !== 'whatsapp') {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    const businessId = request.headers.get('x-business-id');
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    // Process each message
    for (const message of payload.messages) {
      if (message.type === 'text' && message.text?.body) {
        await processIncomingMessage(businessId, message);
      } else if (message.type === 'image') {
        // Handle image messages (e.g., payment proof)
        await sendWhatsAppMessage(
          message.from,
          'Thanks for the image! For bookings and inquiries, please send a text message.',
          process.env.OPENCLAW_WEBHOOK_URL || undefined
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'ai-concierge-whatsapp' });
}
