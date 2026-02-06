# AI Concierge - Sprint TODO

## Week 1: WhatsApp MVP (2026-02-06)

### 🔴 High Priority - IN PROGRESS

| Task | Owner | Status | Notes |
|------|-------|--------|-------|
| [x] Data models (Prisma schema) | Sasuke/Goku | DONE | 6 models created |
| [x] Project scaffold | Goku | DONE | Next.js + TypeScript |
| [x] Minimax-M2.1 integration | Goku | DONE | Intent + response generation |
| [x] WhatsApp webhook handler | Goku | DONE | OpenClaw integration |
| [x] Reminder system (Inngest) | Goku | DONE | 24h + 1h reminders |
| [ ] Calendar integration | Goku | IN PROGRESS | Google Calendar API |
| [ ] Conversation flows | Sasuke | NEXT | TBD |
| [ ] Booking slot logic | Goku | NEXT | TBD |

### 🟡 Medium Priority

| Task | Owner | Status |
|------|-------|--------|
| [ ] Natural language parser | Sasuke/Goku |
| [ ] Business onboarding flow | Sasuke |
| [ ] Q&A intent classifier | Goku |
| [ ] CI/CD pipeline | Conan |

### 🟢 Low Priority

| Task | Owner | Status |
|------|-------|--------|
| [ ] API specifications | Zoro |
| [ ] Marketing messaging | Zoro |
| [ ] Competitor research | Shikamaru |
| [ ] Monitoring/analytics | Conan |

---

## Week 2: Polish

| Task | Owner | Status |
|------|-------|--------|
| [ ] Edge case testing | Conan |
| [ ] Performance optimization | Goku |
| [ ] Error handling | Conan |
| [ ] User documentation | Zoro |
| [ ] Demo video | Zoro |

---

## Week 3: Website Chat Widget

| Task | Owner | Status |
|------|-------|--------|
| [ ] Widget design | Sasuke |
| [ ] Widget frontend | Goku |
| [ ] Widget backend integration | Goku |
| [ ] Widget testing | Conan |

---

## ✅ Completed This Week

| Task | Owner | Date |
|------|-------|------|
| [x] Project structure | Ruby | 2026-02-06 |
| [x] Agent squad assigned | Ruby | 2026-02-06 |
| [x] Tech stack confirmed | Ruby | 2026-02-06 |
| [x] Prisma schema (6 models) | Sasuke/Goku | 2026-02-06 |
| [x] Project scaffold | Goku | 2026-02-06 |
| [x] LLM integration | Goku | 2026-02-06 |
| [x] WhatsApp webhook | Goku | 2026-02-06 |
| [x] Reminder system | Goku | 2026-02-06 |

---

## 📁 Project Structure

```
ai-concierge/
├── simplebiz/                    ← MVP codebase
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── webhooks/whatsapp/
│   │   │   │   └── inngest/
│   │   │   ├── dashboard/
│   │   │   └── whatsapp/
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── database.ts      ← Prisma client
│   │   │   ├── llm.ts           ← Minimax-M2.1
│   │   │   ├── calendar.ts      ← Google Calendar
│   │   │   └── utils.ts
│   │   ├── prisma/schema.prisma ← 6 models
│   │   └── inngest/
│   │       ├── client.ts
│   │       └── functions/reminders.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── .env.example
├── agents/                      ← Agent workspace
│   └── [agent-name]/
└── COORDINATION.md
```

---

*Last Updated: 2026-02-06*
*Status Key: TODO → IN PROGRESS → NEXT → DONE*
