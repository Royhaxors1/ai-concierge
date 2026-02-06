# AI Concierge - Project Coordination Hub

## Project Vision
**"AI Booking Concierge for Local Services"**

An autonomous AI agent that handles customer bookings, reminders, and Q&A via WhatsApp for local service businesses (salons, tutors, contractors, consultants).

---

## Timeline

| Week | Focus | Deliverable |
|------|-------|-------------|
| **Week 1** | WhatsApp MVP | Working booking flow, Google Calendar sync, reminders |
| **Week 2** | Polish & Refine | Testing, edge cases, performance, documentation |
| **Week 3** | Website Chat | Embeddable widget extending WhatsApp backend |

---

## Agent Squad

| Agent | Role | Owner |
|-------|------|-------|
| 🤵 **Ruby** | Overall Project Manager | @roy |
| 🥷 **Sasuke** | Product Design | @ruby |
| 🎭 **Zoro** | Marketing | @ruby |
| 🧠 **Goku** | Engineering | @ruby |
| 👁️ **Shikamaru** | Research | @ruby |
| 🔍 **Conan** | Quality Assurance | @ruby |

---

## Current Sprint: Week 1 MVP

### Goal
Working WhatsApp-first AI Booking Concierge with:
- [ ] Business profile setup
- [ ] Google Calendar integration
- [ ] Natural language booking
- [ ] Automated reminders
- [ ] Simple Q&A

### Active Tasks

#### Priority 1 (In Progress)
| Task | Owner | Status | ETA |
|------|-------|--------|-----|
| Define data models | Sasuke | [IN PROGRESS] | Today |
| Set up Supabase database | Goku | [IN PROGRESS] | Today |
| Integrate Minimax-M2.1 | Goku | [NEXT] | Today |

#### Priority 2 (Next)
| Task | Owner | Status |
|------|-------|--------|
| Design conversation flows | Sasuke |
| Build calendar sync | Goku |
| Create reminder system | Goku |

---

## Tech Stack Confirmed (2026-02-06)

| Component | Choice |
|-----------|--------|
| **LLM** | Minimax-M2.1 |
| **WhatsApp** | OpenClaw |
| **Calendar** | Google Calendar |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Vercel |
| **Queue** | Inngest |

---

## Communication Channel

**All project messages → Telegram Topic 49**

- **Ruby reports** → Topic 49
- **Agent updates** → Topic 49
- **Decisions** → Topic 49
- **Progress updates** → Topic 49

No cross-channel noise. Everything in one place.

---

## Communication Rules

1. **Start every session** → Read COORDINATION.md
2. **Task assignment** → Marked with @agent_name
3. **Work handoff** → Drop file in agents/[name]/INBOX/
4. **Task complete** → Mark `[DONE]` in TODO section
5. **Blockers** → Post in ARCHIVE/BLOCKERS.md

---

## Progress Tracker

### Week 1 Goals
- [ ] WhatsApp API integrated
- [ ] Business profile data model defined
- [ ] Google Calendar sync working
- [ ] Natural language parser for bookings
- [ ] Reminder system implemented
- [ ] Basic Q&A working

### Completed
- [x] Project structure created
- [x] Agent squad assigned

---

## Meeting Notes

_(Add meeting notes here)_

---

## Key Decisions

| Decision | Date | Notes |
|----------|------|-------|
| WhatsApp-first MVP | 2026-02-06 | Channel confirmed |
| Google Calendar integration | 2026-02-06 | Primary calendar |
| Single agent personality | 2026-02-06 | "Helpful, efficient, friendly" |

---

## Links

- [x] Project Memory: `shared/memory/`
- [x] Specifications: `agents/[role]/`
- [x] Archive: `ARCHIVE/`

---

*Last Updated: 2026-02-06*
*Ruby - Project Manager*
