// Booking Slot Logic - Calculate available slots from calendar
import { prisma } from '@/lib/database';
import { getCalendarEvents, calculateAvailableSlots } from '@/lib/calendar';
import { addDays, format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { parseOperatingHours, getDayName } from '@/lib/utils';

export interface TimeSlot {
  id: string;
  date: string;      // "2026-02-10"
  day: string;       // "Monday"
  time: string;      // "10:00 AM"
  datetime: Date;
  duration: number;  // minutes
}

export interface SlotRequest {
  businessId: string;
  serviceId?: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  customerPreferences?: {
    morning?: boolean;
    afternoon?: boolean;
  };
}

// Get available slots for a service
export async function getAvailableSlots(request: SlotRequest): Promise<TimeSlot[]> {
  const { businessId, serviceId, duration = 60 } = request;
  
  // Get business settings
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      operatingHours: true,
      googleCalendarId: true,
      googleTokens: true,
      timezone: true,
    },
  });

  if (!business) {
    throw new Error('Business not found');
  }

  // Parse operating hours
  const operatingHours = parseOperatingHours(business.operatingHours) 
    || getDefaultOperatingHours();

  // Get date range (next 14 days by default)
  const start = request.startDate || new Date();
  const end = request.endDate || addDays(start, 14);

  // Get calendar events if connected
  let calendarEvents: Array<{ id: string; start: Date; end: Date }> = [];
  if (business.googleCalendarId && business.googleTokens) {
    try {
      const events = await getCalendarEvents(
        business.googleCalendarId,
        business.googleTokens as Record<string, unknown>,
        start,
        end
      );
      calendarEvents = events.map(e => ({
        id: e.id,
        start: e.start,
        end: e.end,
      }));
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
    }
  }

  // Parse work hours
  const workHours = parseWorkHours(operatingHours);

  // Generate slots
  const slots: TimeSlot[] = [];
  let currentDate = startOfDay(start);

  while (isBefore(currentDate, end)) {
    const dayName = getDayName(currentDate).toLowerCase();
    const dayHours = operatingHours[dayName] || [];

    // Skip closed days
    if (dayHours.length === 0) {
      currentDate = addDays(currentDate, 1);
      continue;
    }

    // Parse each time slot for this day
    for (const timeRange of dayHours) {
      const [startTime, endTime] = timeRange.split('-');
      const slotStart = parseTime(currentDate, startTime);
      
      // Generate slots for this time range
      while (isBefore(addMinutes(slotStart, duration), parseTime(currentDate, endTime))) {
        const slotEnd = addMinutes(slotStart, duration);
        
        // Check if slot conflicts with calendar events
        const hasConflict = calendarEvents.some(event => 
          (isBefore(slotStart, event.end) && isAfter(slotStart, event.start)) ||
          (isBefore(slotEnd, event.end) && isAfter(slotEnd, event.start)) ||
          (isBefore(slotStart, event.start) && isAfter(slotEnd, event.end))
        );

        // Check if slot is in the past
        const isPast = isBefore(slotStart, new Date());

        // Check customer preferences
        const hour = slotStart.getHours();
        const matchesPreference = 
          (!request.customerPreferences?.morning || hour < 12) &&
          (!request.customerPreferences?.afternoon || hour >= 12);

        if (!hasConflict && !isPast && matchesPreference) {
          slots.push({
            id: `${format(currentDate, 'yyyy-MM-dd')}-${format(slotStart, 'HHmm')}`,
            date: format(currentDate, 'yyyy-MM-dd'),
            day: getDayName(currentDate),
            time: format(slotStart, 'h:mm a'),
            datetime: slotStart,
            duration,
          });
        }

        slotStart = addMinutes(slotStart, 30); // 30-minute intervals
      }
    }

    currentDate = addDays(currentDate, 1);
  }

  return slots.slice(0, 20); // Return max 20 slots
}

// Create a booking
export async function createBooking(data: {
  businessId: string;
  serviceId: string;
  customerPhone: string;
  customerName?: string;
  slotId: string;
  notes?: string;
}) {
  const { businessId, serviceId, customerPhone, customerName, slotId, notes } = data;

  // Parse slot ID to get date/time
  const [dateStr, timeStr] = slotId.split('-');
  const startTime = parseTime(parseISO(dateStr), timeStr.slice(0, 2) + ':' + timeStr.slice(2));
  const endTime = addMinutes(startTime, 60); // Default 60 min

  // Get service for duration and price
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  // Get or create customer
  const customer = await prisma.customer.upsert({
    where: {
      businessId_phone: {
        businessId,
        phone: customerPhone,
      },
    },
    update: {
      name: customerName || undefined,
      totalBookings: { increment: 1 },
    },
    create: {
      businessId,
      phone: customerPhone,
      name: customerName,
      totalBookings: 1,
    },
  });

  // Create appointment
  const appointment = await prisma.appointment.create({
    data: {
      businessId,
      customerId: customer.id,
      serviceId,
      customerName: customerName || 'Customer',
      customerPhone,
      startTime,
      endTime: addMinutes(startTime, service.durationMin),
      pricePaid: service.price,
      serviceName: service.name,
      status: 'pending',
      notes,
    },
  });

  return appointment;
}

// Cancel a booking
export async function cancelBooking(appointmentId: string, businessId: string) {
  // Update appointment status
  const appointment = await prisma.appointment.update({
    where: {
      id: appointmentId,
      businessId, // Ensure ownership
    },
    data: {
      status: 'cancelled',
    },
    include: {
      reminders: true,
    },
  });

  // Cancel scheduled reminders
  await prisma.reminder.updateMany({
    where: {
      appointmentId,
      status: 'pending',
    },
    data: {
      status: 'cancelled',
    },
  });

  return appointment;
}

// Get appointments for a customer
export async function getCustomerAppointments(
  businessId: string,
  customerPhone: string
) {
  return prisma.appointment.findMany({
    where: {
      businessId,
      customerPhone,
      startTime: {
        gte: new Date(),
      },
      status: {
        in: ['pending', 'confirmed'],
      },
    },
    include: {
      service: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}

// Helper functions
function parseTime(date: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

function parseWorkHours(hours: Record<string, string[]>): { start: number; end: number } {
  // Simplified - assumes all days have same hours
  return { start: 9, end: 18 }; // 9 AM to 6 PM
}

function getDefaultOperatingHours(): Record<string, string[]> {
  return {
    monday: ['09:00-18:00'],
    tuesday: ['09:00-18:00'],
    wednesday: ['09:00-18:00'],
    thursday: ['09:00-18:00'],
    friday: ['09:00-18:00'],
    saturday: ['09:00-14:00'],
    sunday: [],
  };
}
