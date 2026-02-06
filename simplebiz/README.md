# AI Concierge

AI Booking Concierge for Local Services — an autonomous AI agent that handles customer bookings, reminders, and Q&A via WhatsApp.

## Features

- 📅 **Natural Language Booking** — "Book a haircut Saturday 2pm"
- 🔔 **Automated Reminders** — 24h and 1h before appointments
- 💬 **WhatsApp Integration** — Works where customers already are
- 📅 **Google Calendar Sync** — Real-time availability
- 🤖 **AI-Powered** — Minimax-M2.1 for intent detection and responses

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `INNGEST_EVENT_KEY` | Inngest event key |
| `INNGEST_SIGNING_KEY` | Inngest signing key |
| `OPENCLAW_GATEWAY_URL` | OpenClaw gateway URL |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── webhooks/whatsapp/  # WhatsApp webhook
│   │   └── inngest/            # Inngest functions
│   ├── dashboard/              # Business dashboard
│   └── whatsapp/               # WhatsApp-specific pages
├── components/                 # UI components
├── lib/
│   ├── database.ts            # Prisma client
│   ├── calendar.ts            # Google Calendar
│   ├── llm.ts                # Minimax-M2.1 integration
│   └── utils.ts              # Utilities
├── prisma/
│   └── schema.prisma          # Database schema
└── inngest/
    ├── client.ts              # Inngest setup
    └── functions/
        └── reminders.ts       # Reminder functions
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL) + Prisma
- **AI**: Minimax-M2.1
- **Messaging**: OpenClaw (WhatsApp)
- **Scheduling**: Inngest
- **Calendar**: Google Calendar API
- **Styling**: Tailwind CSS

## License

MIT
