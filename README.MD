# Project Plan: Offline-First Educational Web Application

## Project Goal
To design and build a **lightweight, offline-first web application** that enables students in rural schools with low or unreliable internet connectivity to access learning materials without disruption.

---

## Problem Overview
Many digital learning platforms fail in rural areas due to slow or inconsistent internet. This limits students’ access to educational resources and increases the learning gap.

---

## Proposed Solution
We will build a **Progressive Web App (PWA)** that works offline by default. Learning content such as lessons and quizzes will be stored locally on the device and synced only when internet connectivity is available. This ensures continuous learning even in low-bandwidth environments.

---

## Key Features
- Offline-accessible lessons (text and images)
- Offline quizzes and practice questions
- Local progress tracking
- Installable PWA support
- Manual data sync when internet is available

---

## Technologies Used
- **Frontend:** Next.js, HTML, CSS  
- **Offline Support:** Service Workers, IndexedDB / localStorage  
- **Backend (Optional):** Node.js, Express  
- **Deployment:** Netlify/Vercel (frontend), Render (backend)

---

## Team Roles & Responsibilities
- *Lithishwaran* - **Frontend Developer:** UI development, offline support, PWA setup  
- *Thamizhanban* - **Backend Developer:** APIs and data sync logic  
- *SujayKiran* - **Integration Lead , Testing & Deployment::** Local storage and data flow, Testing, deployment, documentation  

---

## Sprint Timeline (4 Weeks)
- **Week 1:** Planning, design, project setup  
- **Week 2:** Core development (lessons, quizzes, storage)  
- **Week 3:** Offline caching, integration, testing  
- **Week 4:** Final testing, deployment, documentation  

---

## MVP (Minimum Viable Product)
- Lessons accessible without internet  
- Quizzes usable offline  
- Progress saved locally  
- Installable web app (PWA)

---

## Success Metrics
- MVP completed within 4 weeks  
- All core features work offline  
- Successful demo without internet  
- Positive mentor or reviewer feedback  

---

## Folder Structure

src/
├── app/          # Application routes, layouts, and server components
├── components/   # Reusable UI components shared across pages
├── lib/          # Backend utilities (DB, configs, helpers)
├── types/        # Shared TypeScript interfaces and types

### Folder Purpose
- **app/**: Uses Next.js App Router for routing and server-side logic
- **components/**: Keeps UI modular and reusable
- **lib/**: Central place for backend logic like database access and utilities
- **types/**: Ensures type safety across frontend and backend

---

## Setup Instructions

```bash
npm install
npm run dev


## Code Quality & Consistency Setup

### Strict TypeScript Configuration
Strict TypeScript settings are enabled to catch potential bugs early, prevent implicit `any` types, eliminate unused variables, and ensure consistent file naming across environments.

### ESLint & Prettier
ESLint enforces code quality rules while Prettier handles consistent formatting. Together they ensure readable, maintainable, and error-free code.

### Pre-Commit Hooks
Husky and lint-staged run ESLint and Prettier before every commit, preventing bad code from entering the repository and maintaining team-wide consistency.
