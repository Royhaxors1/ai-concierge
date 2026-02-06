// Appointments API - CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { createBooking, cancelBooking, getAvailableSlots } from '@/lib/bookings';
import { scheduleReminders } from '@/inngest/functions/reminders';

// GET /api/appointments - List appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const customerPhone = searchParams.get('customerPhone');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      );
    }

    const where: any = { businessId };

    if (customerPhone) {
      where.customerPhone = customerPhone;
    }

    if (status) {
      where.status = status;
    }

    if (startDate) {
      where.startTime = { gte: new Date(startDate) };
    }

    if (endDate) {
      where.startTime = {
        ...where.startTime,
        lte: new Date(endDate),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        customer: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessId,
      serviceId,
      customerPhone,
      customerName,
      slotId,
      notes,
    } = body;

    // Validate required fields
    if (!businessId || !serviceId || !customerPhone || !slotId) {
      return NextResponse.json(
        { error: 'Missing required fields: businessId, serviceId, customerPhone, slotId' },
        { status: 400 }
      );
    }

    // Create the booking
    const appointment = await createBooking({
      businessId,
      serviceId,
      customerPhone,
      customerName,
      slotId,
      notes,
    });

    // Schedule reminders
    await scheduleReminders(appointment.id);

    // Fetch full appointment with relations
    const fullAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: {
        service: true,
        customer: true,
      },
    });

    return NextResponse.json(fullAppointment, { status: 201 });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// GET /api/appointments/slots - Get available slots
export async function GET_slots(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const serviceId = searchParams.get('serviceId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      );
    }

    // Get service for duration
    let duration: number | undefined;
    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      duration = service?.durationMin;
    }

    const slots = await getAvailableSlots({
      businessId,
      serviceId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      duration,
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
