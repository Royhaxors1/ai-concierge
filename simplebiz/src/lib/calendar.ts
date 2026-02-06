// Google Calendar Integration
// Handles availability checking and event creation

import { google } from '@googlemaps/google-maps-services-js';
import { addMinutes, parseISO, format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

// Get OAuth2 client with tokens
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// Refresh access token if needed
async function refreshAccessToken(tokens: {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}): Promise<typeof tokens> {
  const auth = getOAuth2Client();
  
  if (tokens.expiry_date && Date.now() > tokens.expiry_date - 60000) {
    auth.setCredentials({ refresh_token: tokens.refresh_token });
    const { credentials } = await auth.refreshAccessToken();
    return credentials;
  }
  
  return tokens;
}

// Get calendar events for a date range
export async function getCalendarEvents(
  calendarId: string,
  tokens: Record<string, unknown>,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  try {
    const refreshedTokens = await refreshAccessToken(tokens as any);
    const auth = getOAuth2Client();
    auth.setCredentials(refreshedTokens as any);
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    const response = await calendar.events.list({
      calendarId: calendarId === 'primary' ? 'primary' : calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    return (response.data.items || []).map(event => ({
      id: event.id || '',
      summary: event.summary || '',
      description: event.description || undefined,
      start: parseISO(event.start?.dateTime || event.start?.date || ''),
      end: parseISO(event.end?.dateTime || event.end?.date || ''),
      status: (event.status as 'confirmed' | 'tentative' | 'cancelled') || 'confirmed',
    }));
  } catch (error) {
    console.error('Google Calendar API error:', error);
    return [];
  }
}

// Calculate available time slots based on calendar events
export function calculateAvailableSlots(
  events: CalendarEvent[],
  workHours: { start: number; end: number }, // e.g., { start: 9, end: 18 }
  slotDuration: number, // in minutes
  date: Date
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dateStart = startOfDay(date);
  
  // Generate all possible slots for the day
  for (let hour = workHours.start; hour < workHours.end; hour++) {
    let slotStart = new Date(dateStart);
    slotStart.setHours(hour, 0, 0, 0);
    
    while (slotStart.getHours() < workHours.end) {
      const slotEnd = addMinutes(slotStart, slotDuration);
      
      // Check if slot overlaps with any event
      const hasConflict = events.some(event => 
        isWithinInterval(slotStart, { start: event.start, end: event.end }) ||
        isWithinInterval(addMinutes(slotStart, -1), { start: event.start, end: event.end })
      );
      
      slots.push({
        start: new Date(slotStart),
        end: slotEnd,
        available: !hasConflict,
      });
      
      slotStart = addMinutes(slotStart, 30); // 30-min increments
    }
  }
  
  return slots.filter(slot => slot.available);
}

// Create a calendar event for an appointment
export async function createCalendarEvent(
  calendarId: string,
  tokens: Record<string, unknown>,
  appointment: {
    summary: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    attendeeEmail?: string;
  }
): Promise<string | null> {
  try {
    const refreshedTokens = await refreshAccessToken(tokens);
    const auth = getOAuth2Client();
    auth.setCredentials(refreshedTokens as any);
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    const event = {
      summary: appointment.summary,
      description: appointment.description,
      start: {
        dateTime: appointment.startTime.toISOString(),
        timeZone: process.env.TIMEZONE || 'Asia/Singapore',
      },
      end: {
        dateTime: appointment.endTime.toISOString(),
        timeZone: process.env.TIMEZONE || 'Asia/Singapore',
      },
      attendees: appointment.attendeeEmail 
        ? [{ email: appointment.attendeeEmail }] 
        : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours
          { method: 'popup', minutes: 60 }, // 1 hour
        ],
      },
    };
    
    const response = await calendar.events.insert({
      calendarId: calendarId === 'primary' ? 'primary' : calendarId,
      requestBody: event,
      sendUpdates: 'all',
    });
    
    return response.data.id || null;
  } catch (error) {
    console.error('Failed to create calendar event:', error);
    return null;
  }
}

// Delete/cancel a calendar event
export async function deleteCalendarEvent(
  calendarId: string,
  tokens: Record<string, unknown>,
  eventId: string
): Promise<boolean> {
  try {
    const refreshedTokens = await refreshAccessToken(tokens);
    const auth = getOAuth2Client();
    auth.setCredentials(refreshedTokens as any);
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    await calendar.events.delete({
      calendarId: calendarId === 'primary' ? 'primary' : calendarId,
      eventId,
      sendUpdates: 'all',
    });
    
    return true;
  } catch (error) {
    console.error('Failed to delete calendar event:', error);
    return false;
  }
}
