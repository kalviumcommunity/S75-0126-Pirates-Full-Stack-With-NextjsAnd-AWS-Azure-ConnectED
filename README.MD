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
