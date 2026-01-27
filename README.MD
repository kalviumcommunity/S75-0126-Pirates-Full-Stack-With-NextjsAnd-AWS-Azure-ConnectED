# Offline-First Education Platform

## Problem Statement
For rural schools with low bandwidth, digital learning resources often fail to load.
This project aims to rethink digital education by building a lightweight,
offline-first web application that allows students to access learning content
reliably even with slow or intermittent internet connectivity.

---

## Tech Stack
- Next.js (TypeScript, App Router)
- PostgreSQL (planned)
- Prisma ORM (planned)
- AWS / Azure (planned deployment)

---

## Project Structure

src/
├── app/          # Application routes, layouts, and server components
├── components/   # Reusable UI components
├── lib/          # Backend utilities, helpers, and configuration
├── types/        # Shared TypeScript types and interfaces

### Why This Structure?
This structure enforces clear separation of concerns and supports scalability.
Backend logic is isolated inside `lib`, making it easier to integrate Prisma,
PostgreSQL, authentication, and offline-first utilities in future sprints.
Frontend, backend, and DevOps work can progress independently without conflicts.

---

## GitHub Workflow & Collaboration Guidelines

To maintain code quality and enable smooth collaboration, our team follows a
professional GitHub workflow inspired by real-world engineering teams.

---

### Branch Naming Conventions
All contributors follow a consistent branch naming strategy:

- `feature/<feature-name>` – New features
- `fix/<bug-name>` – Bug fixes
- `chore/<task-name>` – Tooling, setup, refactors
- `docs/<update-name>` – Documentation updates

**Examples:**
- `feature/login-auth`
- `fix/navbar-alignment`
- `chore/github-workflow`
- `docs/update-readme`

This convention improves clarity, traceability, and easier code reviews.

---

### Pull Request (PR) Template
A standard PR template is used for all pull requests to ensure consistency and
clarity during reviews.

**Location:**

Prisma ORM Integration

We use Prisma ORM to connect our Next.js application to a PostgreSQL database. Prisma provides type-safe, auto-generated queries that simplify database operations, improve reliability, and boost developer productivity. Our setup includes defining models in schema.prisma, generating the Prisma Client, and initializing a single reusable client instance for the app. This allows us to perform safe and efficient database queries while keeping code clean and maintainable.

Database Migrations & Seeding (Prisma ORM)

In this assignment, I implemented reproducible database migrations and data seeding using Prisma ORM to ensure a consistent database schema and initial data across development environments.

Migrations Workflow

Initialized the schema and applied changes using:

npx prisma migrate dev --name init_schema


Created additional migrations for schema updates:

npx prisma migrate dev --name <migration_name>


Reset and re-applied migrations safely during development using:

npx prisma migrate reset


Verified generated SQL files inside prisma/migrations/ to understand schema changes.

Seeding Data

Created a seed script at prisma/seed.ts to insert initial user data.

Configured the seed command in package.json.

Ran the seed using:

npx prisma db seed


Ensured idempotency so re-running the seed does not create duplicate records.

Verification

Used Prisma Studio to verify schema and seeded data:

npx prisma studio


Production Safety Reflection

Migrations are tested locally and in staging before production.

Database backups are taken prior to applying migrations.

Destructive commands like migrate reset are never used in production.

## Transactions & Query Optimisation

### Transaction Usage
We implemented a transactional workflow where a project and its initial task are created together. If any step fails, Prisma automatically rolls back the entire operation, ensuring data consistency.

### Rollback Verification
We intentionally triggered a failure during development to confirm that no partial writes occurred, validating atomicity.

### Query Optimisations
- Used `select` instead of `include` to avoid over-fetching
- Paginated results using `take`
- Used `createMany` for batch inserts

### Indexes Added
Indexes were added on frequently queried fields such as `projectId`, `status`, and `createdAt` to improve lookup and sorting performance.

### Performance Evidence
Prisma query logs before and after indexing showed improved execution patterns and reduced query cost.

### Anti-patterns Avoided
- N+1 queries
- Full table scans
- Over-fetching relational data

### Production Monitoring Plan
In production, query latency, slow queries, and error rates would be monitored using database logs and cloud tools like AWS RDS Performance Insights.

## API Route Structure & Naming

The backend APIs follow RESTful conventions using Next.js App Router file-based routing.

### Route Hierarchy
- GET /api/users – Fetch users (supports pagination)
- POST /api/users – Create a new user
- GET /api/tasks – Fetch tasks
- POST /api/tasks – Create a task
- GET /api/projects – Fetch projects

### Design Decisions
- Used plural, lowercase resource names
- HTTP verbs define actions instead of route names
- Pagination via query parameters for scalable list endpoints
- Meaningful HTTP status codes for success and error cases

This structure ensures predictability, easy onboarding for teammates, and clean scalability as APIs grow.


### Reflection: Global API Response Handler

Implementing a global API response handler significantly improved the consistency and reliability of our backend APIs. By enforcing a unified response envelope across all endpoints, both success and error responses now follow a predictable structure.

This approach improved developer experience (DX) by:
- Eliminating ambiguity in API responses
- Reducing conditional checks on the frontend
- Making debugging easier with standardized error codes and timestamps

From an observability perspective, structured error responses allow easier integration with logging and monitoring tools such as Postman monitors, Sentry, or server logs. Each error includes a clear code and timestamp, which helps trace issues faster in production environments.

Overall, this pattern ensures scalability, maintainability, and better collaboration across team members, as every developer follows the same response contract for APIs.

## Unified API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ],
  "timestamp": "2026-01-19T10:30:00Z"
}



# Input Validation with Zod

## Overview

This project implements input validation for API routes using **Zod**, a TypeScript-first schema validation library. The goal is to ensure that all incoming `POST` and `PUT` requests contain valid, well-structured data before reaching application logic or the database.

By enforcing validation at the API boundary, the application becomes safer, more predictable, and easier to maintain.

---

## Why Input Validation Matters

APIs operate in an untrusted environment. Any client can send malformed, incomplete, or invalid data.

Without validation:
- Invalid data can corrupt the database
- Business logic may behave unpredictably
- Errors surface late and are harder to debug

Input validation ensures that only data matching a predefined contract is allowed into the system.

---

## Zod Schema Definition

Schemas define what valid input looks like. They act as a single source of truth for data structure and constraints.

```ts
// lib/schemas/userSchema.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  age: z.number().int().min(18, "User must be 18 or older"),
});

export type UserInput = z.infer<typeof userSchema>;


## Authentication APIs (Signup & Login)

Signup flow (plaintext → bcrypt hash → DB)

Login flow (compare → JWT issue)

Token expiry (1h)

Token payload (id, email, role)

## Responsive & Themed Design (2.32)

- Implemented custom Tailwind breakpoints for mobile, tablet, and desktop.
- Added class-based dark mode using Tailwind CSS v4.
- Built a persistent theme toggle using React Context and localStorage.
- Ensured accessible color contrast in both light and dark themes.

### Breakpoints
| Device | Width |
|------|------|
| Mobile | < 640px |
| Tablet | 768px |
| Desktop | 1024px+ |

### Accessibility Notes
- High contrast colors tested in both themes
- Theme toggle is keyboard and screen-reader accessible
