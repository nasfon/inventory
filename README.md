# IMS — Inventory Management System

A multi-shop inventory, sales, customer-credit, and expense web app.

* **Frontend:** React SPA (Vite 8 + React 19 + TypeScript)
* **Backend:** Supabase (PostgreSQL, Auth, Data API/PostgREST, RLS, Storage)
* **Speed is a core feature** — see `AGENTS.md` section 4 for the performance rules every change must follow.

## Tech Stack

| Purpose | Library |
| ------- | ------- |
| Build tool | Vite 8 |
| UI framework | React 19 (React Compiler enabled) |
| Component library | Material UI (MUI) |
| Styling | Tailwind CSS v4 |
| Animation | GSAP |
| Server state | TanStack Query |
| Data tables | TanStack Table |
| Forms | React Hook Form |
| Validation | Zod |
| Backend | Supabase Client SDK |

## Commands

```bash
npm run dev       # start dev server
npm run build     # typecheck (tsc -b) + production build
npm run lint      # eslint
npm run preview   # preview production build
```

## Getting Started

1. Copy `.env.example` to `.env` and set your Supabase project URL and anon key.
2. `npm install`
3. `npm run dev`

## Project Structure

* `src/` — application source
* `docs/` — product, spec, and engineering docs
* `TODO.md` — phase-by-phase progress checklist (`[x]` done, `[ ]` pending)
* `AGENTS.md` — agent guide; read first before any work
* `docs/Database Schema Guide.md` — rules for schema, migrations, RPC, and triggers

## Documentation

* `AGENTS.md` — coding/performance rules for agents and developers
* `TODO.md` — roadmap progress tracking
* `docs/` — PRD, System Architecture, Database Design, API, Frontend UI, Security/RBAC, Deployment, Test Plan, Acceptance Criteria & UAT, and more
