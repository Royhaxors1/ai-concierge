# Week 1 Task - Goku

## Objective
Build the technical foundation: database, LLM integration, and API structure.

## Your Tasks

### 1. Set Up Supabase
Create `src/lib/database.ts`:
- Prisma schema (implement Sasuke's spec)
- Database connection to Supabase
- Migration scripts

### 2. Integrate Minimax-M2.1
Create `src/lib/llm.ts`:
- Gateway connection for Minimax-M2.1
- Intent classification function
- Entity extraction for booking details
- Response generation function

### 3. Project Scaffold
Create basic Next.js structure:
```
src/
├── app/
│   ├── api/
│   │   ├── webhooks/whatsapp/
│   │   ├── calendar/
│   │   └── appointments/
│   └── whatsapp/
├── components/
├── lib/
└── prisma/
```

## Deliverable
Working project scaffold with database connection and LLM integration by EOD Week 1 Day 1.

## Coordination
- Wait for Sasuke's data model before implementing schema
- Test with Roy before moving to next task
