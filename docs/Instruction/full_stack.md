PROJECT:
DonorLink — National Blood Infrastructure & Redistribution Intelligence Platform

STACK:
MERN Monorepo Architecture

Frontend:
- React
- Vite
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- Zustand
- React Router
- Recharts
- Framer Motion

Mobile:
- React Native Expo
- Expo Router
- TypeScript
- NativeWind
- Zustand
- React Query

Backend:
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Redis
- BullMQ
- JWT Authentication

Infrastructure:
- Docker
- Docker Compose
- Nginx
- PNPM Workspace
- Turborepo

==================================================
CRITICAL INSTRUCTIONS
==================================================

This project must be completely restructured and rebuilt according to the new architecture.

The current structure is outdated and should be fully migrated into a scalable modular architecture.

IMPORTANT:
- Preserve useful existing business logic where possible
- Refactor aggressively
- Remove obsolete structure
- Reorganize entire backend into domain modules
- Follow healthcare-grade architecture standards
- Follow clean architecture principles where practical
- Use modular monolith architecture
- Use domain-based separation
- Build production-grade code
- Build scalable architecture
- Use strict TypeScript everywhere

==================================================
PROJECT PURPOSE
==================================================

DonorLink is NOT a blood donation app.

It is a national blood infrastructure platform for the Ethiopian National Blood Bank.

The platform provides:
- centralized blood inventory intelligence
- hospital coordination
- blood redistribution
- shortage detection
- expiry prevention
- donor recruitment
- emergency coordination
- national analytics
- AI-assisted operational recommendations

The Ethiopian National Blood Bank is the central governing authority.

Hospitals are managed organizations within the platform.

==================================================
PHASE 1 — FULL BACKEND RESTRUCTURE
==================================================

FIRST PRIORITY:
Fully restructure backend architecture before frontend implementation.

==================================================
BACKEND ARCHITECTURE
==================================================

Restructure backend into:

apps/api/src/

with:

- config/
- core/
- infrastructure/
- modules/
- jobs/
- queues/
- database/
- tests/

==================================================
MODULE-BASED STRUCTURE
==================================================

Each domain module must follow:

module/
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── validators/
├── types/
├── events/
├── jobs/
├── utils/
└── index.ts

==================================================
REQUIRED MODULES
==================================================

Implement these backend modules:

- auth
- users
- organizations
- hospitals
- donors
- donations
- requests
- inventory
- transfers
- logistics
- analytics
- alerts
- campaigns
- forecasting
- recommendations
- emergency
- notifications
- audit
- dashboard

==================================================
AUTHENTICATION & ACCESS CONTROL
==================================================

Implement enterprise-grade RBAC.

ROLES:
- SUPER_ADMIN
- NATIONAL_ADMIN
- NATIONAL_ANALYST
- REGIONAL_ADMIN
- HOSPITAL_ADMIN
- LAB_STAFF
- DISPATCHER
- DONOR_COORDINATOR
- DONOR

Use:
- JWT auth
- refresh tokens
- role guards
- organization-based access control
- permission middleware

IMPORTANT:
Single authentication system with multi-organization RBAC.

Hospitals do NOT self-register publicly.

Only Ethiopian National Blood Bank admins can create organizations.

==================================================
ORGANIZATION SYSTEM
==================================================

Implement organization hierarchy.

Organization types:
- National Blood Bank
- Regional Blood Center
- Hospital
- Donation Center

Each organization must support:
- organization code
- organization type
- region
- staff management
- permissions

==================================================
CORE DATABASE MODELS
==================================================

Implement complete production-grade Mongoose models.

REQUIRED MODELS:
- User
- Organization
- Role
- Donor
- Donation
- BloodUnit
- InventoryLedger
- BloodRequest
- TransferRequest
- TransferShipment
- Alert
- Notification
- Campaign
- EmergencyEvent
- Recommendation
- AuditLog

==================================================
BLOOD UNIT TRACKING
==================================================

Implement unit-level blood tracking.

BloodUnit fields:
- donorId
- bloodType
- componentType
- collectionDate
- expiryDate
- status
- organizationId
- currentHospitalId
- barcode
- QRCode
- lifecycle history

BloodUnit statuses:
- collected
- tested
- available
- reserved
- transferred
- received
- used
- expired
- discarded

==================================================
INVENTORY SYSTEM
==================================================

Implement complete inventory orchestration.

Features:
- hospital inventory
- stock tracking
- reservations
- allocation
- expiry monitoring
- utilization tracking
- shortage detection

Implement immutable inventory ledger system.

Inventory actions:
- collected
- allocated
- transferred_out
- transferred_in
- used
- expired
- discarded

==================================================
TRANSFER SYSTEM
==================================================

Implement hospital redistribution system.

Features:
- transfer requests
- approval workflow
- dispatch workflow
- transport tracking
- transfer lifecycle
- ETA estimation
- emergency escalation

Transfer statuses:
- pending
- approved
- dispatched
- in_transit
- received
- completed
- rejected
- cancelled

==================================================
SMART ENGINE SYSTEM
==================================================

DO NOT use expensive AI APIs initially.

Build deterministic intelligence systems.

Implement:

1. SHORTAGE ENGINE
- shortage scoring
- depletion prediction
- demand analysis

2. EXPIRY ENGINE
- expiry risk detection
- redistribution recommendations

3. RECOMMENDATION ENGINE
- nearby hospital matching
- surplus analysis
- smart transfer recommendations

4. FORECASTING ENGINE
- future shortage estimation
- usage trend analysis

These systems must primarily use:
- rules engines
- scoring algorithms
- statistical calculations
- database analytics

==================================================
QUEUE & JOB SYSTEM
==================================================

Implement:
- BullMQ
- Redis queues
- scheduled jobs

Required jobs:
- expiry monitoring
- shortage monitoring
- analytics aggregation
- donor campaign automation
- notification dispatch
- recommendation generation

==================================================
EVENT-DRIVEN ARCHITECTURE
==================================================

Implement event-based workflows.

Events:
- blood_unit_created
- blood_expiring
- shortage_detected
- transfer_requested
- transfer_completed
- emergency_declared
- campaign_triggered

==================================================
ALERT SYSTEM
==================================================

Implement centralized operational alerting.

Alert types:
- shortage
- expiry
- emergency
- transfer_delay
- inventory_risk
- campaign_required

Severity:
- low
- medium
- high
- critical

==================================================
NOTIFICATION SYSTEM
==================================================

Implement:
- email notifications
- SMS notifications
- push notifications
- in-app notifications

Use queue-based notification delivery.

==================================================
ANALYTICS SYSTEM
==================================================

Implement:
- national analytics
- hospital analytics
- transfer analytics
- donor analytics
- wastage analytics
- utilization analytics
- emergency analytics

==================================================
API REQUIREMENTS
==================================================

Build fully production-grade REST APIs.

Requirements:
- pagination
- filtering
- sorting
- validation
- error handling
- audit logging
- rate limiting
- structured responses

Use:
- zod validators
- centralized error handling
- request logging

==================================================
DOCKER REQUIREMENTS
==================================================

Implement complete Docker infrastructure.

Create:
- backend Dockerfile
- web Dockerfile
- docker-compose.yml
- docker-compose.dev.yml
- docker-compose.prod.yml

Include services:
- api
- web
- mongodb
- redis
- nginx

==================================================
MONGODB REQUIREMENTS
==================================================

Use:
- indexes
- aggregation pipelines
- optimized schemas
- soft deletes where appropriate
- audit timestamps

==================================================
REDIS REQUIREMENTS
==================================================

Use Redis for:
- queues
- caching
- rate limiting
- analytics caching
- notification queues

==================================================
PACKAGES STRUCTURE
==================================================

Implement shared packages:

packages/types
packages/validators
packages/constants
packages/ui
packages/recommendation-engine
packages/shortage-engine
packages/expiry-engine
packages/forecasting-engine

==================================================
CODE QUALITY REQUIREMENTS
==================================================

Requirements:
- strict TypeScript
- reusable architecture
- scalable folder structure
- clean naming
- DTO patterns
- service abstraction
- repository abstraction
- reusable validators
- healthcare-grade reliability

==================================================
IMPORTANT IMPLEMENTATION ORDER
==================================================

Execute in this exact order:

1. Restructure monorepo
2. Configure Docker infrastructure
3. Setup backend foundation
4. Setup MongoDB models
5. Setup authentication/RBAC
6. Setup organizations system
7. Setup inventory engine
8. Setup transfer system
9. Setup analytics
10. Setup recommendation engines
11. Setup queues/jobs
12. Complete API routes/controllers
13. Seed demo data
14. THEN begin frontend implementation

==================================================
FRONTEND IMPLEMENTATION
==================================================

ONLY after backend completion.

Use the provided Design/ folder as source of truth.

Implement:
- web dashboard
- inventory management
- transfer marketplace
- national command center
- analytics dashboards
- emergency coordination
- donor recruitment system

Use:
- feature-based frontend architecture
- TanStack Query
- Zustand
- responsive layouts
- role-based routing
- reusable operational components

==================================================
MOBILE IMPLEMENTATION
==================================================

After web implementation.

Implement:
- donor mobile app
- hospital operational app
- emergency alerts
- inventory visibility
- transfer approvals
- donor campaigns

==================================================
FINAL REQUIREMENTS
==================================================

The final system must feel like:

“A national healthcare logistics and blood intelligence infrastructure platform.”

NOT:
“A basic blood donation application.”

The implementation must be:
- scalable
- modular
- production-grade
- presentation-ready
- operationally realistic
- architecturally correct
- healthcare-grade