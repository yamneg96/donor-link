PROJECT:
DonorLink Backend System

PURPOSE:
DonorLink is a centralized national blood infrastructure and healthcare logistics platform for the Ethiopian National Blood Bank.

This backend is NOT a simple CRUD API.

It is a healthcare operational intelligence system responsible for:

- national blood inventory orchestration
- hospital coordination
- blood redistribution
- shortage detection
- expiry prevention
- emergency response coordination
- donor recruitment intelligence
- transfer logistics
- operational analytics
- auditability
- healthcare-grade traceability

The Ethiopian National Blood Bank is the central governing authority.

Hospitals operate independently but under centralized visibility, coordination, and governance.

The backend must support:
- real-time operational intelligence
- multi-organization architecture
- RBAC permissions
- inventory event tracking
- deterministic recommendation engines
- healthcare-grade auditability
- future scalability

ARCHITECTURE STYLE:
- Modular Monolith
- Domain Driven Design (DDD inspired)
- Feature/Domain Modules
- Event-driven workflows
- Queue-based background processing

STACK:
- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Redis
- BullMQ
- Docker
- PNPM Workspace

==================================================
BACKEND ROOT STRUCTURE
==================================================

apps/api/src/

This is the backend application root.

==================================================
ROOT FILES
==================================================

app.ts
Purpose:
- configure express app
- register middleware
- register routes
- configure global services
- initialize queues/events

Responsibilities:
- express initialization
- middleware registration
- route mounting
- health checks
- error handlers

--------------------------------------------------

server.ts
Purpose:
- application bootstrap
- connect database
- connect redis
- initialize jobs
- start HTTP server

Responsibilities:
- infrastructure startup
- server lifecycle management

==================================================
CONFIG/
==================================================

Purpose:
Centralized infrastructure configuration.

Contains:
- environment configuration
- database connection
- redis connection
- logger configuration
- storage configuration

Files:

config/
├── database.ts
├── env.ts
├── logger.ts
├── redis.ts
└── storage.ts

--------------------------------------------------

database.ts
Purpose:
MongoDB connection configuration.

Responsibilities:
- mongoose initialization
- connection retries
- connection logging
- database event handling

--------------------------------------------------

env.ts
Purpose:
Validate and expose environment variables.

Use:
- zod validation
- strict typing

Must validate:
- database URLs
- redis URLs
- JWT secrets
- SMTP configs
- SMS credentials
- storage credentials

--------------------------------------------------

redis.ts
Purpose:
Redis connection management.

Responsibilities:
- BullMQ connection
- caching
- pub/sub

--------------------------------------------------

logger.ts
Purpose:
Centralized logging.

Use:
- Winston or Pino

Support:
- structured logs
- request logs
- error logs
- operational logs

==================================================
CORE/
==================================================

Purpose:
Reusable backend core infrastructure.

Contains:
- middleware
- utilities
- constants
- guards
- errors
- permissions
- shared types

Structure:

core/
├── constants/
├── errors/
├── events/
├── guards/
├── middleware/
├── permissions/
├── types/
└── utils/

==================================================
CORE/MIDDLEWARE
==================================================

middleware/
├── authenticate.ts
├── authorize.ts
├── validate.ts
├── errorHandler.ts
├── requestLogger.ts
├── rateLimiter.ts
└── organizationScope.ts

--------------------------------------------------

authenticate.ts
Purpose:
JWT verification.

Responsibilities:
- validate access token
- attach authenticated user
- reject unauthorized access

--------------------------------------------------

authorize.ts
Purpose:
Role-based authorization.

Example:
allowRoles([
  "SUPER_ADMIN",
  "HOSPITAL_ADMIN"
])

--------------------------------------------------

organizationScope.ts
Purpose:
Restrict users to organization-specific data.

Example:
Hospital staff cannot access another hospital’s inventory.

==================================================
CORE/EVENTS
==================================================

Purpose:
Application event system.

Events:
- blood_unit_created
- blood_expiring
- shortage_detected
- transfer_requested
- transfer_completed
- emergency_declared

Use:
- decoupled workflows
- analytics triggers
- notifications
- audit logs

==================================================
INFRASTRUCTURE/
==================================================

Purpose:
External services and integrations.

Structure:

infrastructure/
├── ai/
├── email/
├── integrations/
├── monitoring/
├── push/
├── queue/
├── sms/
└── storage/

==================================================
INFRASTRUCTURE/AI
==================================================

Purpose:
Lightweight AI/recommendation integrations.

IMPORTANT:
Do NOT use expensive LLMs for operational logic.

AI usage should only support:
- summaries
- reports
- operational recommendations

Core operational logic must remain deterministic.

==================================================
MODULES/
==================================================

MOST IMPORTANT DIRECTORY.

Purpose:
Business domain modules.

Every feature/domain must be isolated.

Each module follows:

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
WHY THIS STRUCTURE EXISTS
==================================================

controllers/
- HTTP layer only
- request/response handling
- no business logic

services/
- business logic
- orchestration
- workflows

repositories/
- database abstraction
- mongoose queries
- aggregation pipelines

models/
- mongoose schemas

validators/
- zod validation schemas

events/
- domain events

jobs/
- scheduled/background jobs

utils/
- module-specific helpers

==================================================
AUTH MODULE
==================================================

Purpose:
Authentication and session management.

Structure:

modules/auth/
├── controllers/
├── services/
├── repositories/
├── routes/
├── validators/
├── utils/
└── types/

Responsibilities:
- login
- refresh token
- logout
- password reset
- OTP verification
- JWT lifecycle

IMPORTANT:
Single authentication system.

Different organizations use same login system.

Access determined by:
- role
- organization
- permissions

==================================================
ORGANIZATIONS MODULE
==================================================

Purpose:
Multi-organization system.

This is critical.

Organizations:
- Ethiopian National Blood Bank
- Regional Centers
- Hospitals
- Donation Centers

Features:
- organization creation
- organization hierarchy
- organization codes
- onboarding workflows

IMPORTANT:
Hospitals do NOT self-register publicly.

Only National Blood Bank admins can onboard organizations.

==================================================
USERS MODULE
==================================================

Purpose:
User management.

Features:
- staff accounts
- donor accounts
- role assignment
- organization assignment

Roles:
- SUPER_ADMIN
- NATIONAL_ADMIN
- REGIONAL_ADMIN
- HOSPITAL_ADMIN
- LAB_STAFF
- DISPATCHER
- DONOR_COORDINATOR
- DONOR

==================================================
DONORS MODULE
==================================================

Purpose:
Voluntary donor management.

Features:
- donor profiles
- eligibility tracking
- donation history
- donor availability
- geographic targeting

==================================================
DONATIONS MODULE
==================================================

Purpose:
Donation event tracking.

Responsibilities:
- donation recording
- blood collection
- blood processing
- donation lifecycle

IMPORTANT:
Every donation creates BloodUnit records.

==================================================
INVENTORY MODULE
==================================================

MOST IMPORTANT MODULE.

Purpose:
National blood inventory orchestration.

Features:
- hospital inventory
- stock tracking
- reservations
- allocation
- inventory analytics
- expiry monitoring

==================================================
BLOOD UNIT TRACKING
==================================================

Use UNIT-LEVEL tracking.

NOT aggregate stock only.

Each blood unit must track:
- donor source
- blood type
- component type
- collection date
- expiry date
- current organization
- lifecycle state
- transfer history

==================================================
INVENTORY LEDGER
==================================================

Implement immutable inventory events.

Example actions:
- collected
- allocated
- transferred_out
- transferred_in
- used
- expired
- discarded

Purpose:
- auditability
- analytics
- traceability
- debugging
- forecasting

==================================================
TRANSFERS MODULE
==================================================

Purpose:
Hospital redistribution coordination.

Features:
- transfer requests
- transfer approvals
- shipment tracking
- transport workflows
- ETA tracking

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
RECOMMENDATIONS MODULE
==================================================

Purpose:
Operational intelligence.

IMPORTANT:
Use deterministic recommendation engines.

NOT expensive AI.

Features:
- nearby hospital matching
- shortage recommendations
- redistribution suggestions
- surplus detection

Example:
“Transfer 4 O- units from Hospital A to Hospital B.”

==================================================
SHORTAGE ENGINE
==================================================

Purpose:
Detect inventory risk.

Example scoring:

shortageScore =
  usageRate +
  depletionRate +
  emergencyRequests +
  lowInventoryPenalty

==================================================
EXPIRY ENGINE
==================================================

Purpose:
Prevent wastage.

Responsibilities:
- monitor expiry
- detect risk
- trigger redistribution suggestions

Example:
“12 A+ units expiring in 48 hours.”

==================================================
FORECASTING MODULE
==================================================

Purpose:
Predict future shortages.

Features:
- usage trend analysis
- demand forecasting
- seasonal patterns

==================================================
EMERGENCY MODULE
==================================================

Purpose:
Emergency coordination.

Features:
- emergency declarations
- emergency redistribution
- emergency donor mobilization

==================================================
CAMPAIGNS MODULE
==================================================

Purpose:
Donor recruitment intelligence.

Features:
- targeted donor campaigns
- blood-type campaigns
- regional campaigns
- emergency campaigns

==================================================
ANALYTICS MODULE
==================================================

Purpose:
Operational intelligence dashboards.

Features:
- national analytics
- hospital analytics
- transfer analytics
- wastage analytics
- utilization analytics

Use:
- MongoDB aggregation pipelines
- cached analytics

==================================================
ALERTS MODULE
==================================================

Purpose:
Centralized operational alerting.

Alert types:
- shortage
- expiry
- emergency
- transfer_delay
- inventory_risk

Severity:
- low
- medium
- high
- critical

==================================================
AUDIT MODULE
==================================================

Purpose:
Healthcare traceability and compliance.

Track:
- inventory changes
- transfer actions
- approval actions
- user actions
- emergency escalations

IMPORTANT:
Audit logs must be immutable.

==================================================
JOBS/
==================================================

Purpose:
Background/scheduled tasks.

Examples:
- expiry monitoring
- shortage monitoring
- recommendation generation
- analytics aggregation
- donor campaign automation

==================================================
QUEUES/
==================================================

Purpose:
Async processing with BullMQ.

Queues:
- email queue
- sms queue
- notification queue
- transfer queue
- analytics queue

==================================================
DATABASE/
==================================================

database/
├── migrations/
├── seeders/
└── indexes/

Purpose:
Database infrastructure management.

==================================================
TESTS/
==================================================

tests/
├── integration/
├── unit/
└── e2e/

Purpose:
Production-grade backend testing.

==================================================
IMPORTANT ARCHITECTURAL RULES
==================================================

1. Controllers must remain thin.
Business logic belongs in services.

2. Services orchestrate workflows.

3. Repositories handle database logic only.

4. Events decouple workflows.

5. Jobs handle background processing.

6. Inventory must use unit-level tracking.

7. Auditability is mandatory.

8. Role-based access is critical.

9. Organization scoping is mandatory.

10. Smart systems should be deterministic initially.

==================================================
IMPORTANT IMPLEMENTATION PRIORITY
==================================================

1. Infrastructure setup
2. Docker setup
3. Config system
4. Core architecture
5. Authentication
6. Organizations
7. Inventory engine
8. Transfers system
9. Recommendation engines
10. Analytics
11. Notifications
12. Jobs/queues
13. Final optimization