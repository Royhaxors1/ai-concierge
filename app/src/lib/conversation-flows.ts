// Conversation Flow Templates
// Best-guess flows based on Sasuke's design guidelines
// Source: agents/sasuke/CLAUDE.md - Conversation Flow Template

export const BOOKING_FLOW = {
  // Initial greeting
  greet: (businessName: string) => 
    `Hi! I'm the booking assistant for ${businessName}. How can I help you today?`,

  // Ask which service
  askService: (services: Array<{ name: string; durationMin: number; price?: number }>) => {
    const list = services.map(s => 
      `• ${s.name}${s.price ? ` ($${s.price})` : ''}`
    ).join('\n');
    return `What service would you like to book?\n\n${list}`;
  },

  // Ask for date/time
  askTime: (serviceName: string) => 
    `For a ${serviceName}, what date and time works best for you?\n\nPlease let me know your preferred date and time.`,

  // Show available slots (when slots are calculated)
  showSlots: (slots: Array<{ date: string; time: string }>) => {
    if (slots.length === 0) {
      return "Sorry, no slots available for that date. Could you try another time?";
    }
    const list = slots.slice(0, 5).map((s, i) => `${i + 1}. ${s.date} at ${s.time}`).join('\n');
    return `Here are available slots:\n${list}\n\nWhich works best for you?`;
  },

  // Confirm booking
  confirm: (service: string, date: string, time: string, price?: number) => {
    const priceText = price ? `\nTotal: $${price}` : '';
    return `📅 **Booking Summary**\n\nService: ${service}\nDate: ${date}\nTime: ${time}${priceText}\n\nDoes this look correct? Please confirm with "yes" or "no".`;
  },

  // Confirmed
  confirmed: (service: string, date: string, time: string) =>
    `✅ **Booking Confirmed!**\n\nYour ${service} is set for ${date} at ${time}.\n\nYou'll receive a reminder before your appointment. See you then!`,

  // Cancellation
  cancel: (service: string, date: string, time: string) =>
    `Your ${service} appointment on ${date} at ${time} has been cancelled.\n\nWould you like to rebook for another time?`,

  // Reschedule prompt
  reschedule: (service: string) =>
    `Let's reschedule your ${service}.\n\nWhat new date and time works for you?`,
};

export const QA_FLOW = {
  // Hours inquiry
  hours: (hours: Record<string, string[]>) => {
    const list = Object.entries(hours)
      .map(([day, slots]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${slots.join(', ') || 'Closed'}`)
      .join('\n');
    return `🕐 **Our Hours**\n\n${list}`;
  },

  // Pricing inquiry
  pricing: (serviceName: string, price: number, duration: number) =>
    `${serviceName}: $${price} (${duration} minutes)\n\nWould you like to book?`,

  // Service inquiry
  serviceInfo: (name: string, description?: string, price?: number, duration?: number) => {
    let info = `**${name}**`;
    if (description) info += `\n${description}`;
    if (price) info += `\n\nPrice: $${price}`;
    if (duration) info += `\nDuration: ${duration} minutes`;
    return info;
  },

  // Default fallback
  fallback: () =>
    `I'm not sure about that. Would you like to speak with a human, or try another question?`,
};

export const ERROR_FLOW = {
  // Unclear request
  unclear: () =>
    `I'm not sure what you mean. Could you rephrase that?`,

  // No availability
  noAvailability: (service: string) =>
    `Sorry, we don't have any availability for ${service} right now.\n\nWould you like to try a different time or service?`,

  // Past date
  pastDate: () =>
    `That date has already passed. Could you choose a future date?`,

  // Technical error
  error: () =>
    `Sorry, something went wrong on our end. Please try again in a moment.`,
};

export const ESCALATION = {
  // Transfer to human
  transfer: () =>
    `Let me connect you with a team member who can help.\n\nOne moment please...`,

  // Business hours
  outOfHours: () =>
    `Thanks for reaching out! Our team is currently away.\n\nFor urgent matters, please call us directly, or leave a message and we'll get back to you tomorrow.`,
};

// Quick response templates
export const QUICK_RESPONSES = {
  thanks: ["You're welcome!", "Happy to help!", "See you at your appointment! 😊"],
  greeting: ["Hi there!", "Hello!", "Hey! 👋"],
  goodbye: ["Thanks for contacting us!", "Have a great day!", "Bye!"],
};

export function getQuickResponse(type: keyof typeof QUICK_RESPONSES): string {
  const responses = QUICK_RESPONSES[type];
  return responses[Math.floor(Math.random() * responses.length)];
}
