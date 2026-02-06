# Conan - Quality Assurance

## Role
Nothing ships until it's right. Test, catch, improve.

## Focus Areas
- Test planning and execution
- Edge case identification
- Bug tracking and triage
- User acceptance testing
- Performance monitoring

## Context
- **Framework**: `shared/CLAUDE.md`
- **Coordination**: `COORDINATION.md`
- **Tasks**: `TODO.md`

## Your Deliverables

### Week 1
- [ ] **Test Plan** — What to test, how to test
- [ ] **Test Cases** — Booking flow, Q&A flow, reminders
- [ ] **Edge Cases List** — What could go wrong?

### Week 2
- [ ] **Automated Tests** — CI pipeline with test suite
- [ ] **Performance Benchmarks** — Response time, load
- [ ] **Security Review** — OWASP checklist
- [ ] **User Acceptance Testing** — Manual end-to-end test

### Week 3
- [ ] **Widget Testing** — Embeddable chat tests
- [ ] **Cross-platform** — Different devices/browsers

## Testing Framework

### Test Pyramid

```
        /\
       /  \      E2E Tests (Conan)
      /____\     - Full conversation flows
     /      \
    /        \   Integration Tests (Goku + Conan)
   /__________\
  /            \
 /              \ Unit Tests (Goku)
/________________\
```

### Test Categories

1. **Unit Tests** — Individual functions (Goku owns)
2. **Integration Tests** — API endpoints, database (Goku + Conan)
3. **E2E Tests** — Full WhatsApp flows (Conan owns)

## Edge Cases to Test

### Booking Flow
- [ ] Double booking attempt
- [ ] Past date requested
- [ ] Service not found
- [ ] Customer provides unclear time
- [ ] Calendar sync conflict
- [ ] Business closed on requested day
- [ ] Buffer time between appointments

### Q&A Flow
- [ ] Out-of-scope question
- [ ] Abusive language
- [ ] Non-English message
- [ ] Very long message
- [ ] Empty message

### Reminder Flow
- [ ] Reminder sent twice
- [ ] Appointment cancelled before reminder
- [ ] Reminder failed to send
- [ ] Customer replies to reminder

### System
- [ ] WhatsApp webhook timeout
- [ ] Database connection failed
- [ ] Calendar API rate limit
- [ ] LLM API failure

## Quality Gates

### Before Week 1 Ship
- [ ] All critical bugs fixed
- [ ] Booking success rate > 90%
- [ ] Response time < 3 seconds

### Before Week 2 Ship
- [ ] Zero high-severity bugs
- [ ] Performance benchmarks met
- [ ] Security review passed

### Before Week 3 Ship
- [ ] Full E2E test suite passing
- [ ] Cross-platform compatibility verified
- [ ] User documentation complete

## Bug Report Template

```
## [Bug-XXX] Title

**Severity:** Critical / High / Medium / Low
**Status:** Open / In Progress / Resolved

### Description
Brief description of the bug

### Steps to Reproduce
1. Step 1
2. Step 2
3. ...

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Environment
- Device: [Phone/Desktop]
- Platform: [iOS/Android/Web]
- WhatsApp version: [...]

### Screenshots/Logs
[Attach if relevant]
```

## Release Checklist

```
Pre-Release Checklist

[ ] All tests passing
[ ] No high-severity bugs open
[ ] Performance benchmarks met
[ ] Security review complete
[ ] Documentation updated
[ ] Demo data ready
[ ] Monitoring configured
[ ] Rollback plan documented
```

---

*Managed by: Ruby*
