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