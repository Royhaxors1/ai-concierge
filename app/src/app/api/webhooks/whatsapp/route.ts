// WhatsApp Webhook Handler - OpenClaw Integration
// Receives incoming messages and routes them for processing

import { NextRequest, NextResponse } from 'next/server';
import { detectIntent, LLMMessage } from '@/lib/llm';
import { prisma } from '@/lib/database';
import { getAvailableSlots, createBooking, cancelBooking } from '@/lib/bookings';
import { format, parseISO, addMinutes } from 'date-fns';

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

// Conversation states for multi-turn booking
interface BookingState {
  step: 'service' | 'time' | 'confirm' | 'complete';
  serviceId?: string;
  serviceName?: string;
  selectedSlotId?: string;
  slotDate?: string;
  slotTime?: string;
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
  const messageContent = message.text?.body?.trim().toLowerCase() || '';
  
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
    ? ((conversation.messages || []) as unknown as LLMMessage[])
    : [];

  // Get booking state if in progress
  const bookingState = (conversation?.intent === 'book' || conversation?.intent === 'book_pending')
    ? (conversation as any).bookingState
    : null;

  // Get business context
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { services: { where: { isActive: true } } },
  });

  if (!business) {
    await sendWhatsAppMessage(message.from, 'Sorry, something went wrong. Please try again.');
    return;
  }

  // Route based on conversation state
  let responseMessage = '';
  
  // Check for confirmation keywords
  if (bookingState?.step === 'confirm') {
    if (['yes', 'yep', 'sure', 'confirm', 'ok', 'okay', 'y'].includes(messageContent)) {
      responseMessage = await confirmBooking(businessId, bookingState, customer);
    } else if (['no', 'nope', 'cancel'].includes(messageContent)) {
      responseMessage = `No problem! Your booking is cancelled.\n\nWould you like to book for a different time?`;
      // Clear booking state
      await prisma.conversation.update({
        where: { id: conversation?.id },
        data: { intent: 'other' },
      });
    } else {
      responseMessage = `Please reply "yes" to confirm or "no" to cancel.`;
    }
  }
  // Check for slot selection (number)
  else if (bookingState?.step === 'time' && /^[1-9]$/.test(messageContent)) {
    responseMessage = await selectSlot(businessId, bookingState, parseInt(messageContent), customer);
  }
  // Normal intent routing
  else {
    const intent = await detectIntent(messageContent, history);
    
    switch (intent.intent) {
      case 'book':
        responseMessage = await handleBookingIntent(businessId, intent, customer, business.services);
        break;
      case 'inquire':
        responseMessage = await handleInquiryIntent(intent, business.services, business);
        break;
      case 'cancel':
        responseMessage = await handleCancellationIntent(businessId, customer, business);
        break;
      case 'faq':
        responseMessage = await handleFAQIntent(business);
        break;
      default:
        responseMessage = await handleGenericIntent(business, business.services);
    }
  }

  // Send response
  await sendWhatsAppMessage(
    message.from,
    responseMessage,
    business.openClawWebhookUrl || undefined
  );
}

// Handle booking intent - start booking flow
async function handleBookingIntent(
  businessId: string,
  intent: any,
  customer: any,
  services: any[]
): Promise<string> {
  // If service is identified, show slots
  if (intent.entities.service) {
    const service = services.find(s => 
      s.name.toLowerCase().includes(intent.entities.service?.toLowerCase() || '')
    );
    
    if (service) {
      // Get available slots
      const slots = await getAvailableSlots({
        businessId,
        serviceId: service.id,
        duration: service.durationMin,
      });

      if (slots.length === 0) {
        return `Sorry, no available slots for ${service.name} in the next 2 weeks.\n\nWould you like to try a different service?`;
      }

      // Store booking state
      const conversation = await prisma.conversation.findFirst({
        where: { sessionId: customer.phone, businessId },
      });

      const slotList = slots.slice(0, 5).map((s: any, i: number) => 
        `${i + 1}. ${s.day} ${s.date} at ${s.time}`
      ).join('\n');

      await prisma.conversation.upsert({
        where: {
          businessId_sessionId: {
            businessId,
            sessionId: customer.phone,
          },
        },
        update: {
          intent: 'book_pending',
          bookingState: {
            step: 'time',
            serviceId: service.id,
            serviceName: service.name,
          },
        },
        create: {
          businessId,
          customerId: customer.id,
          sessionId: customer.phone,
          phone: customer.phone,
          messages: [],
          intent: 'book_pending',
          bookingState: {
            step: 'time',
            serviceId: service.id,
            serviceName: service.name,
          },
        },
      });

      return `📅 Available times for ${service.name}:\n\n${slotList}\n\nReply with the number (1-5) to book.`;
    }
  }
  
  // Ask which service
  if (services.length === 0) {
    return "Sorry, no services available right now.";
  }
  
  if (services.length === 1) {
    const service = services[0];
    // Show slots for single service
    const slots = await getAvailableSlots({
      businessId,
      serviceId: service.id,
      duration: service.durationMin,
    });

    if (slots.length === 0) {
      return `Sorry, no available slots for ${service.name} right now.`;
    }

    const slotList = slots.slice(0, 5).map((s: any, i: number) => 
      `${i + 1}. ${s.day} ${s.date} at ${s.time}`
    ).join('\n');

    // Upsert by composite unique key (businessId + sessionId)
    await prisma.conversation.upsert({
      where: {
        businessId_sessionId: {
          businessId,
          sessionId: customer?.phone,
        },
      },
      update: {
        intent: 'book_pending',
        bookingState: { step: 'time', serviceId: service.id, serviceName: service.name },
      },
      create: {
        businessId,
        sessionId: customer?.phone,
        phone: customer?.phone,
        messages: [],
        intent: 'book_pending',
        bookingState: { step: 'time', serviceId: service.id, serviceName: service.name },
      },
    });

    return `📅 Available times for ${service.name}:\n\n${slotList}\n\nReply with the number (1-5) to book.`;
  }
  
  const serviceList = services.map((s: any, i: number) => 
    `${i + 1}. ${s.name} (${s.durationMin}min${s.price ? ` - $${s.price}` : ''})`
  ).join('\n');
  
  return `What service would you like to book?\n\n${serviceList}\n\nReply with the number.`;
}

// Select slot and confirm
async function selectSlot(
  businessId: string,
  bookingState: BookingState,
  slotNumber: number,
  customer: any
): Promise<string> {
  const slots = await getAvailableSlots({
    businessId,
    serviceId: bookingState.serviceId!,
  });

  if (slotNumber < 1 || slotNumber > slots.length) {
    return `Invalid selection. Please reply with a number between 1 and ${Math.min(slots.length, 5)}.`;
  }

  const selectedSlot = slots[slotNumber - 1];

  // Update booking state to confirm
  const conversation = await prisma.conversation.findFirst({
    where: { sessionId: customer.phone, businessId },
  });

  await prisma.conversation.update({
    where: { id: conversation?.id },
    data: {
      intent: 'book_pending',
      bookingState: {
        ...bookingState,
        step: 'confirm',
        selectedSlotId: selectedSlot.id,
        slotDate: selectedSlot.date,
        slotTime: selectedSlot.time,
      },
    },
  });

  return `📋 **Booking Summary**\n\nService: ${bookingState.serviceName}\nDate: ${selectedSlot.day} ${selectedSlot.date}\nTime: ${selectedSlot.time}\n\nReply "yes" to confirm or "no" to cancel.`;
}

// Confirm booking
async function confirmBooking(
  businessId: string,
  bookingState: BookingState,
  customer: any
): Promise<string> {
  if (!bookingState.selectedSlotId || !bookingState.serviceId) {
    return "Something went wrong. Please start over with a new booking.";
  }

  try {
    const appointment = await createBooking({
      businessId,
      serviceId: bookingState.serviceId,
      customerPhone: customer.phone,
      customerName: customer.name,
      slotId: bookingState.selectedSlotId,
    });

    // Clear booking state
    const conversation = await prisma.conversation.findFirst({
      where: { sessionId: customer.phone, businessId },
    });

    if (conversation) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          intent: 'book_complete',
          bookingState: undefined,
        },
      });
    }

    return `✅ **Booking Confirmed!**\n\n📅 ${bookingState.slotDate} at ${bookingState.slotTime}\n\nYou'll receive a reminder before your appointment.\n\nSee you then!`;
  } catch (error) {
    console.error('Booking error:', error);
    return "Sorry, there was a problem creating your booking. Please try again.";
  }
}

// Handle inquiry intent
async function handleInquiryIntent(
  intent: any,
  services: any[],
  business: any
): Promise<string> {
  if (intent.entities.service) {
    const service = services.find(s => 
      s.name.toLowerCase().includes(intent.entities.service?.toLowerCase() || '')
    );
    
    if (service) {
      return `${service.name}\n${service.description || ''}\n\n⏱️ ${service.durationMin} minutes\n💰 ${service.price ? `$${service.price}` : 'Contact for pricing'}\n\nWould you like to book?`;
    }
  }
  
  return "Which service are you interested in?";
}

// Handle cancellation intent
async function handleCancellationIntent(
  businessId: string,
  customer: any,
  business: any
): Promise<string> {
  const appointments = await prisma.appointment.findMany({
    where: {
      businessId,
      customerId: customer.id,
      startTime: { gte: new Date() },
      status: { in: ['pending', 'confirmed'] },
    },
    orderBy: { startTime: 'asc' },
    take: 1,
  });

  if (appointments.length === 0) {
    return "You don't have any upcoming appointments.\n\nWould you like to book one?";
  }

  const apt = appointments[0];
  await cancelBooking(apt.id, businessId);

  return `Your appointment on ${format(apt.startTime, 'PPp')} has been cancelled.\n\nWould you like to rebook for another time?`;
}

// Handle FAQ intent
async function handleFAQIntent(business: any): Promise<string> {
  const hours = business.operatingHours as Record<string, string[]> | undefined;
  
  if (hours) {
    const hourList = Object.entries(hours)
      .map(([day, slots]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${slots.join(', ') || 'Closed'}`)
      .join('\n');
    return `🕐 **Hours**\n\n${hourList}\n\n${business.address ? `📍 ${business.address}\n` : ''}Anything else?`;
  }
  
  return "Please contact us directly for hours and availability.";
}

// Handle generic intent
async function handleGenericIntent(
  business: any,
  services: any[]
): Promise<string> {
  if (services.length > 0) {
    const serviceNames = services.slice(0, 3).map((s: any) => s.name).join(', ');
    return `Hi! 👋 I can help you book ${serviceNames}${services.length > 3 ? ' and more' : ''}.\n\nWhat would you like?`;
  }
  
  return `Hi! 👋 How can I help you today?`;
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const payload: WhatsAppWebhookPayload = await request.json();
    
    if (payload.messaging_product !== 'whatsapp') {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    const businessId = request.headers.get('x-business-id');
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    for (const message of payload.messages) {
      if (message.type === 'text' && message.text?.body) {
        await processIncomingMessage(businessId, message);
      } else if (message.type === 'image') {
        await sendWhatsAppMessage(
          message.from,
          'Thanks for the image! For bookings, please send a text message.',
          process.env.OPENCLAW_WEBHOOK_URL
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
