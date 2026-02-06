# AI Concierge - Master Project Context

## Executive Summary

AI Booking Concierge for Local Services — an autonomous AI agent that handles customer bookings, reminders, and Q&A via WhatsApp for local service businesses (salons, tutors, contractors, consultants).

**Status:** Week 1 MVP Development
**Launch Goal:** Public launch Week 2-3
**Tech Stack:** WhatsApp Business API, Google Calendar, LLM (TBD)

---

## Product Vision

**Core Promise:**
> "Focus on your work. AI handles the scheduling, reminders, and customer questions."

**Target Users:**
- Hair salons & nail technicians
- Tutors & consultants
- Contractors & home services
- Any local service business with appointments

**Value Proposition:**
- 24/7 booking availability
- No more "what time is available?" messages
- Automated reminders = fewer no-shows
- Instant answers to FAQs

---

## MVP Scope (Week 1)

### Must-Have
- WhatsApp Business API integration
- Business profile setup (services, hours, calendar)
- Natural language booking ("Book a haircut Saturday 2pm")
- Google Calendar sync
- Automated reminders (24h + 1h before)
- Simple Q&A ("What are your hours?", "How much for a manicure?")

### Not in MVP
- Website chat widget (Week 3)
- Lead qualification flow
- Payments integration
- Multiple calendar support
- Multi-language (EN only MVP)

---

## Architecture Overview

```
User (WhatsApp)
      │
      ▼
┌─────────────────┐
│  WhatsApp API   │  ← Incoming messages
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Message Router  │  ← Classify: booking / question / other
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌───────┐
│Booking │  │ Q&A   │
│ Engine │  │ Engine│
└───┬───┘  └───┬───┘
    │         │
    ▼         ▼
┌─────────────────┐
│ Google Calendar │  ← Availability & booking
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Reminder Queue │  ← Inngest/cron for reminders
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WhatsApp API   │  ← Outgoing messages
└─────────────────┘
```

---

## Tech Stack (Confirmed)

| Component | Choice | Status |
|-----------|--------|--------|
| **LLM** | Minimax-M2.1 | ✅ Confirmed |
| **WhatsApp** | OpenClaw | ✅ Configured |
| **Calendar** | Google Calendar | ✅ |
| **Database** | Supabase (PostgreSQL) | ✅ Confirmed |
| **Hosting** | Vercel | ✅ Confirmed |
| **Queue** | Inngest | ✅ |

---

## Data Model (Draft)

### Business
- id, name, whatsapp_number, timezone
- operating_hours (JSON)
- services (JSON array)
- google_calendar_id
- created_at

### Service
- id, business_id, name, duration_minutes, price
- description, buffer_time

### Appointment
- id, business_id, customer_id
- customer_name, customer_phone
- service_id, start_time, end_time
- status (pending, confirmed, cancelled, completed)
- notes, created_at

### Customer
- id, business_id, phone, name
- total_appointments, last_contacted_at

### Reminder
- id, appointment_id, type (24h, 1h)
- scheduled_at, sent_at, status

---

## Conversation Flow

### Booking Flow
```
User: "Hi, I'd like to book a haircut"
AI: "Hi! What service would you like?"
User: "Just a regular haircut"
AI: "Great! When works best for you?"
     [Shows available slots based on calendar]
User: "Saturday at 2pm"
AI: "Saturday March 15th, 2pm - Regular Cut ($50)"
     "Confirm?"
User: "Yes"
AI: "Confirmed! 📅 Saved to calendar."
     "I'll send you a reminder tomorrow."
```

### Q&A Flow
```
User: "What are your hours?"
AI: "We're open Mon-Fri 9am-6pm, Sat 9am-4pm. Closed Sunday."

User: "Do you do gel nails?"
AI: "Yes! Gel manicure is $60 and takes about 1 hour."
     "Would you like to book?"
```

### Reminder Flow
```
[24h before appointment]
AI: "Hi [Name]! Reminder: Your haircut is tomorrow at 2pm."
     "See you soon!"

[1h before]
AI: "See you in 1 hour! 📍 [Address]"
```

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Response time | < 3 seconds |
| Availability | 99.9% uptime |
| Booking accuracy | 100% (no double-booking) |
| Data privacy | GDPR compliant |
| Scalability | 100 businesses / 1000 bookings/day |

---

## Success Metrics (Week 1)

| Metric | Target |
|--------|--------|
| Demo ready | ✅ |
| Booking success rate | >90% |
| Calendar sync accuracy | 100% |
| Reminder delivery | >95% |

---

## Key Decisions Made

| Decision | Date | Rationale |
|----------|------|-----------|
| WhatsApp-first MVP | 2026-02-06 | Simpler, proven, SG market is WhatsApp-native |
| Google Calendar | 2026-02-06 | Industry standard, free tier generous |
| OpenClaw for WhatsApp | 2026-02-06 | Already configured, self-hosted = control |

---

## Known Gaps (To Address)

| Gap | Owner | Plan |
|-----|-------|------|
| LLM provider selection | Goku | Evaluate OpenAI vs Claude |
| Database hosting | Goku | Set up Supabase |
| CI/CD pipeline | Conan | GitHub Actions + Vercel |
| Demo business data | Sasuke | Create seed data |

---

## Files Reference

| File | Purpose |
|------|---------|
| `COORDINATION.md` | Agent coordination, sprint goals |
| `TODO.md` | Task tracker |
| `shared/memory/` | Project memory (decisions, learnings) |
| `agents/[role]/` | Agent-specific context |

---

## Contacts

| Role | Name | Responsibility |
|------|------|----------------|
| Product Owner | Roy | Decisions, vision |
| Project Manager | Ruby | Coordination, delivery |

---

*Last Updated: 2026-02-06*
