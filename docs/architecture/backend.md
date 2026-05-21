# Backend Architecture

The DonorLink backend (`apps/api`) is engineered as a **Modular Monolith** using **Node.js, Express, and TypeScript**, backed by **MongoDB and Redis**.

## Module Structure

The backend features 20 highly decoupled domains. Each domain follows a strict folder structure:

```text
module_name/
├── controllers/   # HTTP layer — thin wrappers over services
├── services/      # Core business logic & orchestration
├── repositories/  # Database abstractions
├── models/        # Mongoose schemas
├── routes/        # Express Router definitions
├── validators/    # Zod schemas for input validation
├── types/         # Domain-specific TypeScript interfaces
├── events/        # Domain events publisher/subscriber
├── jobs/          # Background tasks
├── utils/         # Module-specific helpers
└── index.ts       # Barrel export
```

## Core Modules

1. **Auth & Users:** Identity, RBAC, JWT issuance, OTP flows, and staff provisioning.
2. **Organizations & Hospitals:** Hierarchy management, facility onboarding, location tracking.
3. **Inventory:** Tracking BloodUnits, Expiry, and Immutable Ledgers.
4. **Transfers:** Operations to move stock between organizations securely.
5. **Emergency & Alerts:** Fast-tracked logistics overrides and critical shortage notifications.
6. **Campaigns & Donors:** Predictive recruitment drives and eligibility tracking.
7. **Analytics & Dashboard:** Pre-computed aggregations served via Redis caching.

## Background Processing (BullMQ & Redis)

Critical background jobs are decoupled from HTTP requests:
- **`expiryMonitor`**: Nightly scans for expiring blood units.
- **`shortageMonitor`**: Real-time evaluation of regional deficits.
- **`notificationDispatcher`**: Async delivery of SMS, Emails, and Push notifications.
- **`analyticsAggregator`**: Periodic calculation of complex stats.

## Event Bus

A Node.js `EventEmitter` acts as an internal message broker. 
For example, the `Donations` module emits a `blood_unit_created` event, which the `Inventory` and `Analytics` modules independently listen to without direct dependencies.

## Error Handling & Validation

- All incoming data is scrubbed using **Zod** schema middleware.
- A centralized `ErrorHandler` processes custom classes (`AppError`, `NotFoundError`, `ForbiddenError`) to return standardized JSON responses.
