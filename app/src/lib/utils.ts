// Utility Functions

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency = 'SGD'): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string, formatStr = 'PPP'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format time
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Format datetime
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

// Normalize phone number (remove +, spaces, etc.)
export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

// Get day name from date
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-SG', { weekday: 'long' });
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Generate random ID
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Sleep utility for delays
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
}

// Parse operating hours from JSON
export function parseOperatingHours(hours: unknown): Record<string, string[]> | null {
  if (!hours) return null;
  if (typeof hours === 'object') {
    return hours as Record<string, string[]>;
  }
  return null;
}

// Get default operating hours
export function getDefaultOperatingHours(): Record<string, string[]> {
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
