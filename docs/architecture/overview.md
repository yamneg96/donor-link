# Architecture Overview

DonorLink is a national blood infrastructure and redistribution intelligence platform designed to seamlessly connect donors, mobile drives, and hospital trauma centers. The system leverages modern web technologies to ensure mission-critical supply meets urgent demand with absolute reliability.

## System Design

DonorLink utilizes a **Modular Monolith** pattern inside a **Turborepo** monorepo setup. This allows domains to remain strictly isolated while retaining the ease of a unified deployment and development lifecycle.

### Repository Structure

```text
DonorLink/
├── apps/
│   ├── api/            # Node.js + Express backend (Modular Monolith)
│   ├── web/            # React 19 + Vite Staff/Admin Dashboard
│   └── mobile/         # (Future) Donor-facing mobile app
├── packages/
│   ├── constants/      # Shared enums and constants
│   ├── types/          # Shared DTOs and interfaces
│   ├── validators/     # Shared Zod validation schemas
│   └── engines/        # Specialized recommendation & forecasting engines
├── infrastructure/     # Docker, Nginx, and cloud orchestration configs
└── docs/               # System documentation
```

## Technology Stack

- **Frontend (Web):** React 19, Vite, TanStack Router, TanStack Query, Zustand, Tailwind CSS v4, shadcn/ui.
- **Backend (API):** Node.js, Express, TypeScript, Mongoose.
- **Database:** MongoDB (Primary Data Store).
- **Caching & Queues:** Redis, BullMQ.
- **Deployment:** Docker, Nginx, Vercel (for frontend/edge deployment), Google Cloud (for APIs/DB).

## Core Principles

1. **Domain-Driven Design (DDD):** 20 distinct modules isolate business logic. E.g., `Transfers`, `Inventory`, `Emergency`.
2. **Immutable Ledgers:** Audit trails and Inventory movements are strictly immutable for healthcare compliance.
3. **Role-Based Access Control (RBAC):** Tiered access limits visibility and actions to authorized roles (Super Admin, Hospital Admin, Field Staff).
4. **Resiliency:** Critical infrastructure components run asynchronously via BullMQ to tolerate temporary network or service failures.
