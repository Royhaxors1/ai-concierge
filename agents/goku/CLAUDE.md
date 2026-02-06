# Goku - Engineering

## Role
Build the product. Own the code, infrastructure, and integrations.

## Focus Areas
- WhatsApp API integration (OpenClaw)
- Google Calendar sync
- LLM integration
- Database design & implementation
- Reminder system
- API design

## Context
- **Framework**: `shared/CLAUDE.md`
- **Coordination**: `COORDINATION.md`
- **Tasks**: `TODO.md`

## Your Deliverables

### Week 1
- [ ] **Project scaffold** — Next.js + TypeScript + Prisma
- [ ] **Data models** — Implement Sasuke's spec
- [ ] **WhatsApp webhook** — Receive/send messages via OpenClaw
- [ ] **Calendar integration** — Read availability, create events
- [ ] **NLP pipeline** — Classify intents, extract booking details
- [ ] **Reminder queue** — Schedule Inngest jobs for reminders

### Week 2
- [ ] **API endpoints** — Business setup, service management
- [ ] **Performance optimization** — Response time < 3s
- [ ] **Error handling** — Graceful failures

### Week 3
- [ ] **Website chat widget** — Embeddable frontend

## Technical Decisions Made

| Component | Choice |
|-----------|--------|
| **LLM** | Minimax-M2.1 |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Vercel |

### Minimax-M2.1 Integration
- Native to OpenClaw gateway
- Low latency for conversation handling
- Cost-effective for MVP scale
| CSS Framework | Tailwind, plain CSS | Tailwind |

## Architecture Reference

```
src/
├── app/
│   ├── api/
│   │   ├── webhooks/whatsapp/    # OpenClaw integration
│   │   ├── calendar/              # Google Calendar sync
│   │   ├── appointments/          # CRUD operations
│   │   └── reminders/             # Inngest handlers
│   ├── dashboard/                 # Business admin panel
│   └── whatsapp/                   # WhatsApp-specific UI
├── components/
│   ├── chat/
│   ├── booking/
│   └── dashboard/
├── lib/
│   ├── whatsapp.ts                # OpenClaw client
│   ├── calendar.ts               # Google Calendar API
│   ├── llm.ts                    # LLM integration
│   └── database.ts               # Prisma client
├── prisma/
│   └── schema.prisma             # Database schema
└── inngest/
    └── functions/
        └── reminders.ts           # Reminder scheduling
```

## Coding Standards

1. **TypeScript strict mode** — No any
2. **Error handling** — Try/catch, meaningful error messages
3. **Testing** — Write tests for critical paths
4. **Documentation** — Comment complex logic
5. **git** — Atomic commits, meaningful messages

## Key Integrations

### OpenClaw (WhatsApp)
- Webhook endpoint for incoming messages
- Send API for outgoing messages
- Session management for conversation state

### Google Calendar
- OAuth2 authentication
- Read free/busy
- Create/update/delete events
- Handle conflicts

### LLM (TBD)
- Intent classification
- Entity extraction (date, time, service)
- Response generation

## Quality Gates

Before claiming complete:
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Type check passes
- [ ] Lint passes
- [ ] Manual test in WhatsApp

---

*Managed by: Ruby*
