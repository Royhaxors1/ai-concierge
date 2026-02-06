# AI Concierge - Project Memory

## Decision Log

### 2026-02-06 - Project Scope Confirmed
- **Decision**: WhatsApp-first MVP, Website chat in Week 3
- **Rationale**: Simpler to build, proven channel, SG market is WhatsApp-native
- **Owner**: Ruby (approved by Roy)

### 2026-02-06 - Core Features Locked
- **Booking via natural language**
- **Google Calendar integration**
- **Automated reminders (24h + 1h)**
- **Simple Q&A**
- **Excluded**: Payments, multi-language, lead qualification (V2)

## Learnings

_(Add learnings here as project progresses)_

## Technical Decisions

| Decision | Date | Status |
|----------|------|--------|
| LLM Provider | 2026-02-06 | Pending |
| Database | 2026-02-06 | Pending |
| Hosting | 2026-02-06 | Pending |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WhatsApp API rate limits | Medium | Implement caching, graceful degradation |
| LLM cost overruns | Medium | Set usage limits, monitor spend |
| Calendar sync issues | High | Conflict detection, manual override |

## Open Questions

| Question | Owner | Due |
|----------|-------|-----|
| Which LLM to use? | Goku | Week 1 |
| Database provider? | Goku | Week 1 |
| Hosting platform? | Goku | Week 1 |

---

*Last Updated: 2026-02-06*
