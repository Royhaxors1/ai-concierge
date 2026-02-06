# AI Concierge

> **The blueprint for a $100K/month AI agency.** Build once, charge $5-10K per client, scale to 5-10 clients/month.

AI Booking Concierge for Local Services — an autonomous AI agent that handles customer bookings, reminders, and Q&A via WhatsApp.

---

## 🎯 The Vision

**Problem:** Millions of business owners see AI innovations but have no idea how to implement them.

**Solution:** A plug-and-play AI Concierge that:
- Books appointments automatically
- Sends reminders (24h + 1h)
- Answers FAQs 24/7
- Works on WhatsApp (where customers already are)

**Business Model:**
- **Upfront:** $5-10K per client
- **Ongoing:** Low service fee
- **Target:** 5-10 clients/month
- **Revenue:** $100K/month

> "I bet you could charge $5-10k for the initial upfront work and then some low ongoing service fee to keep the thing up to date."

---

## 🚀 Demo in Action

```
Customer: "Hi, I'd like to book a haircut tomorrow at 2pm"
AI Concierge: "Sure! I have 2pm available tomorrow. Confirm?"
Customer: "Yes"
AI Concierge: "✅ Booked! You'll receive a reminder 24h and 1h before."
```

**Zero human intervention. 24/7 availability.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📅 **Natural Language Booking** | "Book a haircut Saturday 2pm" |
| 🔔 **Automated Reminders** | 24h and 1h before appointments |
| 💬 **WhatsApp Integration** | Works where customers already are |
| 📅 **Google Calendar Sync** | Real-time availability |
| 🤖 **AI-Powered** | Minimax-M2.1 for intent detection |
| 🎯 **Multi-Business Ready** | One codebase, multiple clients |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 + TypeScript |
| Database | Supabase (PostgreSQL) + Prisma |
| AI | Minimax-M2.1 |
| Messaging | OpenClaw (WhatsApp) |
| Scheduling | Inngest (reminders) |
| Calendar | Google Calendar API |
| CI/CD | GitHub Actions + Vercel |

---

## 📁 Project Structure

```
ai-concierge/
├── app/                    # Next.js application
│   ├── src/
│   │   ├── lib/          # Core libraries
│   │   │   ├── database.ts    # Prisma client
│   │   │   ├── llm.ts         # Intent detection
│   │   │   ├── calendar.ts    # Google Calendar
│   │   │   ├── bookings.ts    # Slot logic
│   │   │   └── conversation-flows.ts
│   │   ├── api/          # API routes
│   │   │   ├── webhooks/whatsapp/  # WhatsApp handler
│   │   │   ├── appointments/       # CRUD + slots
│   │   │   └── inngest/            # Reminder queue
│   │   ├── prisma/        # Database schema
│   │   └── inngest/       # Background jobs
│   ├── package.json
│   └── README.md
├── agents/                 # Agent coordination
├── scripts/               # Setup & backup
└── .github/              # CI/CD
```

---

## ⚡ Quick Start

```bash
# Clone and enter
git clone https://github.com/Royhaxors1/ai-concierge.git
cd ai-concierge/app

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `INNGEST_EVENT_KEY` | Inngest event key |
| `INNGEST_SIGNING_KEY` | Inngest signing key |
| `OPENCLAW_GATEWAY_URL` | OpenClaw gateway URL |

---

## 🎯 The AI Concierge Playbook

### Phase 1: Build (Week 1)
- ✅ WhatsApp booking MVP
- ✅ Calendar integration
- ✅ Reminder system

### Phase 2: Demo (Week 2)
- Polish the demo flow
- Create pitch deck
- Document the service

### Phase 3: Sell (Week 3+)
- Target: Local service businesses (salons, restaurants, clinics)
- Price: $5-10K upfront
- Close 5-10 clients/month

### Phase 4: Scale
- Template the approach
- Automate onboarding
- Build recurring revenue

---

## 💰 Revenue Calculator

| Clients | Upfront | Monthly | Annual |
|---------|---------|---------|--------|
| 5 | $50K | $500 | $600K |
| 10 | $100K | $1K | $1.2M |

*Monthly = $100/client for maintenance*

---

## 📦 Deliverables

Each AI Concierge client receives:
1. ✅ WhatsApp AI booking system
2. ✅ Google Calendar integration
3. ✅ Automated reminders (24h + 1h)
4. ✅ FAQ automation
5. ✅ Dashboard for managing bookings
6. ✅ 30-day support

---

## 🧠 Built by Agents

| Agent | Role | Status |
|-------|------|--------|
| Ruby | Project Manager | Active |
| Sasuke | Product Design | In Progress |
| Zoro | Marketing | Working on Pitch Deck |
| Goku | Engineering | Core MVP Done |
| Shikamaru | Research | Pending |
| Conan | Quality Assurance | Pending |

---

## 📚 Resources

- **Demo Video:** Coming Week 2
- **Pitch Deck:** Coming Week 2
- **Documentation:** In progress
- **API Reference:** `/api/docs`

---

## 🤝 License

MIT — Build, sell, scale.

---

**Built in Singapore 🇸🇬**
**Timezone:** Asia/Singapore (UTC+8)
