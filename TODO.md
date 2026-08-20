# IMS Project TODO

Tracking checklist for the Inventory Management System (IMS) MVP.

**Marker convention:** `[x]` = completed, `[ ]` = pending / not started.

---

## Phase 0 — Planning & Setup

- [x] Finalize requirements and confirm scope (MVP vs Future)
- [x] Confirm business rules (credit limits, receipt layout, currency)
- [x] Set up Git repository and branching strategy
- [ ] Provision Supabase project and Vercel project
- [x] Scaffold Vite + React + TypeScript project
- [x] Install and configure frontend libraries (MUI, Tailwind CSS, GSAP, TanStack Query/Table, React Hook Form, Zod)
- [x] Set up project folder structure, MUI theme, and shared component library
- [x] Define environment variables and secrets management (.env.example)

Milestone: Project foundation ready.

---

## Phase 1 — Authentication & Core Setup

- [x] Create database schema (tables, indexes, constraints, RLS policies, RPC functions, seed roles)
- [x] Implement Supabase Auth (login, logout, session handling)
- [x] Create roles table and seed roles (Super Admin, Shop Admin, Cashier)
- [x] Implement user onboarding and role assignment
- [x] Create shops module (CRUD for Super Admin)
- [ ] Implement audit log foundation
- [x] Implement dashboard layout shell (top bar, sidebar, navigation)

Milestone: Authenticated application shell with roles and shops.

---

## Phase 2 — Product & Inventory

- [x] Implement products CRUD
- [ ] Implement stock quantity management
- [ ] Implement product search, sort, filter, pagination
- [ ] Implement low stock threshold and low stock detection
- [ ] Implement stock history recording

Milestone: Inventory module complete.

---

## Phase 3 — Customers & Credit

- [x] Implement customers CRUD
- [ ] Implement customer search by name/phone
- [ ] Implement customer profile with purchase history
- [ ] Implement credit balance tracking
- [ ] Implement credit payments (record payment, mark fully paid)

Milestone: Customer and credit modules complete.

---

## Phase 4 — Sales, Receipts & Expenses

- [x] Implement sales processing (multiple products, payment methods)
- [ ] Implement automatic stock deduction
- [ ] Implement sales history and search
- [ ] Implement receipt generation, printing, and PDF download
- [ ] Implement sales correction and reversal with reason and audit trail
- [ ] Implement expenses module

Milestone: Core operational modules complete.

---

## Phase 5 — Reports, Dashboard & Settings

- [ ] Implement dashboard statistics and widgets
- [ ] Implement reports (sales, revenue, expenses, credit, inventory)
- [ ] Implement business settings
- [ ] Implement role-based UI visibility

Milestone: All MVP modules complete.

---

## Phase 6 — Testing & Hardening

- [ ] Execute test plan (unit, integration, E2E)
- [ ] Verify RLS policies and role permissions
- [ ] Test multi-shop isolation
- [ ] Security review and rate limiting checks
- [ ] Performance and responsiveness checks
- [ ] Fix defects found during testing

Milestone: Code complete and tested.

---

## Phase 7 — UAT & Go-Live

- [ ] Deploy to staging environment
- [ ] Execute user acceptance testing with stakeholders
- [ ] Collect feedback and finalize changes
- [ ] Deploy to production
- [ ] Train users and provide documentation
- [ ] Monitor post-launch

Milestone: MVP launched.