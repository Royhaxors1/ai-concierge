# Demo Page - AI Concierge

This page showcases the AI Concierge booking flow.

## Conversation Flow

### 1. Customer Initiates
```
Customer: "Hi, I'd like to book a haircut"
AI: "Hi! 👋 I can help with that. What service would you like?"
```

### 2. Service Selection
```
Customer: "Just a regular haircut"
AI: "Great! I have availability for:
     - Today at 4pm
     - Tomorrow at 10am, 2pm, 4pm
     Which works for you?"
```

### 3. Time Selection
```
Customer: "Tomorrow at 2pm please"
AI: "📋 Booking Summary:
     Service: Haircut
     Date: Tomorrow
     Time: 2pm
     
     Reply 'yes' to confirm or 'no' to cancel."
```

### 4. Confirmation
```
Customer: "Yes"
AI: "✅ Booked! 
     
     You'll receive reminders:
     - Tomorrow at 2pm (24h before)
     - Tomorrow at 1pm (1h before)
     
     See you then!"
```

## Key Features

### Natural Language Understanding
- Understands various booking requests
- Handles variations: "book", "schedule", "appointment"
- Extracts service, date, time from context

### Smart Availability
- Checks Google Calendar for conflicts
- Respects business operating hours
- Handles multiple services with different durations

### Automated Reminders
- 24 hours before: "Reminder: Your appointment is tomorrow at 2pm"
- 1 hour before: "Your appointment is in 1 hour!"

### FAQ Handling
- Answers questions about services
- Provides business hours
- Handles cancellations

## Technical Flow

```
WhatsApp Message
    ↓
OpenClaw Webhook
    ↓
Intent Detection (Minimax-M2.1)
    ↓
Slot Calculation (Calendar + Hours)
    ↓
Booking Creation (Prisma)
    ↓
Confirmation + Reminders (Inngest)
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/whatsapp` | POST | Receive WhatsApp messages |
| `/api/appointments` | GET | List appointments |
| `/api/appointments` | POST | Create booking |
| `/api/inngest` | POST | Handle reminders |

## Test This Yourself

1. Set up environment variables in `.env.local`
2. Run `npm run dev`
3. Send a WhatsApp message to the configured number
4. Watch the booking flow in action

---

*Demo Guide - AI Concierge*
