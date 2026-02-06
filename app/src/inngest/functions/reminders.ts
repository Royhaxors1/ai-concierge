// Reminder System - Inngest Functions
// Schedules and sends appointment reminders

import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/database';
import { sendWhatsAppMessage } from '@/app/api/webhooks/whatsapp/route';
import { format } from 'date-fns';

// Schedule reminders for an appointment
export async function scheduleReminders(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      business: true,
      customer: true,
      service: true,
    },
  });

  if (!appointment) {
    console.error(`Appointment ${appointmentId} not found`);
    return;
  }

  const { startTime, business, customer, service } = appointment;

  // Schedule 24h reminder
  const reminder24h = new Date(startTime);
  reminder24h.setHours(reminder24h.getHours() - 24);
  
  if (reminder24h > new Date()) {
    await inngest.send({
      name: 'appointment/reminder.send',
      data: {
        appointmentId,
        type: '24h',
        scheduledFor: reminder24h.toISOString(),
      },
    });
  }

  // Schedule 1h reminder
  const reminder1h = new Date(startTime);
  reminder1h.setHours(reminder1h.getHours() - 1);
  
  if (reminder1h > new Date()) {
    await inngest.send({
      name: 'appointment/reminder.send',
      data: {
        appointmentId,
        type: '1h',
        scheduledFor: reminder1h.toISOString(),
      },
    });
  }

  // Create reminder records in database
  await prisma.reminder.createMany({
    data: [
      {
        businessId: business.id,
        appointmentId,
        type: '24h',
        scheduledAt: reminder24h,
        status: 'pending',
        message: `Hi ${customer.name || 'there'}! Reminder: Your ${service.name} is tomorrow at ${format(startTime, 'h:mm a')}. See you then!`,
      },
      {
        businessId: business.id,
        appointmentId,
        type: '1h',
        scheduledAt: reminder1h,
        status: 'pending',
        message: `See you in 1 hour! 📍 Your ${service.name} is at ${format(startTime, 'h:mm a')}.`,
      },
    ],
  });
}

// Reminder sending function
export const sendReminder = inngest.createFunction(
  {
    id: 'send-appointment-reminder',
    name: 'Send Appointment Reminder',
  },
  {
    event: 'appointment/reminder.send',
  },
  async ({ event, step }) => {
    const { appointmentId, type, scheduledFor } = event.data;

    // Wait until scheduled time (in case event fires early)
    const now = new Date();
    const scheduled = new Date(scheduledFor);
    if (scheduled > now) {
      await step.sleepUntil(scheduled);
    }

    // Fetch appointment details
    const appointment = await step.run('fetch-appointment', async () => {
      return prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          business: true,
          customer: true,
          service: true,
        },
      });
    });

    if (!appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    // Check if appointment is still valid
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return { success: false, error: 'Appointment no longer active' };
    }

    // Get reminder message
    const reminder = await step.run('fetch-reminder', async () => {
      return prisma.reminder.findFirst({
        where: {
          appointmentId,
          type,
          status: 'pending',
        },
      });
    });

    const message = reminder?.message || getDefaultReminderMessage(type, appointment);

    // Send WhatsApp message
    const sent = await step.run('send-whatsapp', async () => {
      return sendWhatsAppMessage(
        appointment.customerPhone,
        message,
        appointment.business.openClawWebhookUrl || undefined
      );
    });

    // Update reminder status
    await step.run('update-reminder', async () => {
      if (reminder) {
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            status: sent ? 'sent' : 'failed',
            sentAt: sent ? new Date() : undefined,
          },
        });
      }
    });

    return { success: sent, appointmentId, type };
  }
);

// Get default reminder message
function getDefaultReminderMessage(
  type: '24h' | '1h',
  appointment: {
    serviceName: string;
    startTime: Date;
    customerName?: string | null;
  }
): string {
  const timeStr = format(appointment.startTime, 'EEEE, MMMM d \'at\' h:mm a');
  
  if (type === '24h') {
    return `Hi ${appointment.customerName || 'there'}! 👋\n\nJust a friendly reminder: Your ${appointment.serviceName} is tomorrow.\n\n📅 ${timeStr}\n\nSee you then!`;
  }
  
  return `⏰ See you in 1 hour!\n\nYour ${appointment.serviceName} is at ${format(appointment.startTime, 'h:mm a')}.\n\nReply if you need to reschedule.`;
}

// Cancel scheduled reminders
export async function cancelReminders(appointmentId: string) {
  await prisma.reminder.updateMany({
    where: {
      appointmentId,
      status: 'pending',
    },
    data: {
      status: 'cancelled',
    },
  });
}
