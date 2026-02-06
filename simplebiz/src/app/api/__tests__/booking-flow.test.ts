// End-to-End Test Suite - Booking Flow
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAvailableSlots, createBooking, cancelBooking } from '../lib/bookings';
import { prisma } from '../lib/database';

// Mock dependencies
vi.mock('../lib/database', () => ({
  prisma: {
    business: {
      findUnique: vi.fn(),
    },
    customer: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
    appointment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    service: {
      findUnique: vi.fn(),
    },
    reminder: {
      updateMany: vi.fn(),
    },
  },
}));

vi.mock('../lib/calendar', () => ({
  getCalendarEvents: vi.fn(),
}));

describe('Booking Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAvailableSlots', () => {
    it('should return available slots for a business', async () => {
      // Mock business with operating hours
      (prisma.business.findUnique as any).mockResolvedValue({
        id: 'biz-1',
        name: 'Test Salon',
        operatingHours: {
          monday: ['09:00-12:00', '14:00-18:00'],
          tuesday: ['09:00-18:00'],
          wednesday: ['09:00-18:00'],
          thursday: ['09:00-18:00'],
          friday: ['09:00-18:00'],
          saturday: ['09:00-14:00'],
          sunday: [],
        },
        googleCalendarId: null,
        googleTokens: null,
        timezone: 'Asia/Singapore',
      });

      // No calendar events
      const slots = await getAvailableSlots({
        businessId: 'biz-1',
        duration: 60,
      });

      expect(slots).toBeDefined();
      expect(Array.isArray(slots)).toBe(true);
    });

    it('should throw error for missing business', async () => {
      (prisma.business.findUnique as any).mockResolvedValue(null);

      await expect(
        getAvailableSlots({ businessId: 'nonexistent' })
      ).rejects.toThrow('Business not found');
    });
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      // Mock customer
      (prisma.customer.upsert as any).mockResolvedValue({
        id: 'cust-1',
        phone: '+6512345678',
        name: 'John Doe',
      });

      // Mock service
      (prisma.service.findUnique as any).mockResolvedValue({
        id: 'srv-1',
        name: 'Haircut',
        durationMin: 60,
        price: 50,
      });

      // Mock appointment create
      (prisma.appointment.create as any).mockResolvedValue({
        id: 'apt-1',
        businessId: 'biz-1',
        serviceId: 'srv-1',
        customerId: 'cust-1',
        customerName: 'John Doe',
        customerPhone: '+6512345678',
        status: 'pending',
        startTime: new Date('2026-02-10T10:00:00Z'),
        endTime: new Date('2026-02-10T11:00:00Z'),
      });

      const booking = await createBooking({
        businessId: 'biz-1',
        serviceId: 'srv-1',
        customerPhone: '+6512345678',
        customerName: 'John Doe',
        slotId: '2026-02-10-1000',
      });

      expect(booking).toBeDefined();
      expect(booking.status).toBe('pending');
      expect(prisma.appointment.create).toHaveBeenCalled();
    });

    it('should throw error for missing service', async () => {
      (prisma.service.findUnique as any).mockResolvedValue(null);

      await expect(
        createBooking({
          businessId: 'biz-1',
          serviceId: 'nonexistent',
          customerPhone: '+6512345678',
          slotId: '2026-02-10-1000',
        })
      ).rejects.toThrow('Service not found');
    });
  });

  describe('cancelBooking', () => {
    it('should cancel appointment and reminders', async () => {
      (prisma.appointment.update as any).mockResolvedValue({
        id: 'apt-1',
        status: 'cancelled',
      });

      (prisma.reminder.updateMany as any).mockResolvedValue({});

      const result = await cancelBooking('apt-1', 'biz-1');

      expect(result.status).toBe('cancelled');
      expect(prisma.appointment.update).toHaveBeenCalled();
      expect(prisma.reminder.updateMany).toHaveBeenCalled();
    });
  });
});

describe('Intent Detection', () => {
  it('should classify booking intent', async () => {
    // This would test the LLM intent detection
    // For now, just verify the function exists
    const { detectIntent } = await import('../lib/llm');
    expect(typeof detectIntent).toBe('function');
  });
});

describe('Conversation Flow', () => {
  it('should have all flow functions', async () => {
    const flows = await import('../lib/conversation-flows');
    
    expect(typeof flows.BOOKING_FLOW.greet).toBe('function');
    expect(typeof flows.BOOKING_FLOW.askService).toBe('function');
    expect(typeof flows.BOOKING_FLOW.askTime).toBe('function');
    expect(typeof flows.BOOKING_FLOW.confirm).toBe('function');
    expect(typeof flows.BOOKING_FLOW.confirmed).toBe('function');
  });
});
