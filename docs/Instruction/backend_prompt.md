Implement the entire DonorLink backend system as a production-grade national healthcare logistics and blood intelligence platform.

IMPORTANT:
This is NOT a CRUD tutorial project.

This is a healthcare operational infrastructure system for the Ethiopian National Blood Bank.

The backend must support:
- centralized national blood visibility
- hospital inventory orchestration
- redistribution intelligence
- shortage detection
- expiry prevention
- donor recruitment
- emergency coordination
- auditability
- healthcare-grade operational reliability

==================================================
ARCHITECTURE REQUIREMENTS
==================================================

Use:
- Modular Monolith Architecture
- Domain-driven module separation
- Event-driven workflows
- Queue-based async processing

Stack:
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Redis
- BullMQ
- Docker

==================================================
CRITICAL IMPLEMENTATION REQUIREMENTS
==================================================

1. Completely restructure the backend.

2. Remove outdated flat controller/service structure.

3. Implement fully modular architecture.

4. Use strict TypeScript everywhere.

5. Build scalable production-grade code.

6. Use healthcare-grade auditability.

7. Implement organization-based RBAC.

8. Implement unit-level blood tracking.

9. Implement deterministic recommendation engines.

10. Implement queue-based background jobs.

==================================================
BACKEND MODULE REQUIREMENTS
==================================================

Implement all modules completely:

- auth
- users
- organizations
- hospitals
- donors
- donations
- inventory
- transfers
- logistics
- analytics
- alerts
- campaigns
- emergency
- forecasting
- recommendations
- notifications
- audit
- dashboard

==================================================
AUTH SYSTEM
==================================================

Implement:
- JWT auth
- refresh tokens
- role-based access control
- organization-based access
- permission middleware
- OTP verification
- secure password reset

Roles:
- SUPER_ADMIN
- NATIONAL_ADMIN
- REGIONAL_ADMIN
- HOSPITAL_ADMIN
- LAB_STAFF
- DISPATCHER
- DONOR_COORDINATOR
- DONOR

IMPORTANT:
Use single authentication system with organization-based RBAC.

==================================================
ORGANIZATION SYSTEM
==================================================

Implement organization hierarchy.

Organization types:
- National Blood Bank
- Regional Center
- Hospital
- Donation Center

Only National Blood Bank admins can onboard organizations.

Hospitals cannot self-register publicly.

==================================================
INVENTORY SYSTEM
==================================================

Implement complete inventory orchestration.

Use unit-level blood tracking.

Each BloodUnit must support:
- donor tracking
- lifecycle tracking
- expiry tracking
- organization ownership
- transfer history

Implement immutable InventoryLedger.

==================================================
TRANSFER SYSTEM
==================================================

Implement:
- transfer requests
- approval workflows
- dispatch workflows
- shipment tracking
- transfer lifecycle

==================================================
RECOMMENDATION ENGINES
==================================================

Implement deterministic intelligence systems.

NO expensive AI APIs required.

Build:
- shortage scoring engine
- expiry risk engine
- redistribution recommendation engine
- forecasting engine

Use:
- rules
- scoring algorithms
- analytics
- aggregation pipelines

==================================================
EVENT SYSTEM
==================================================

Implement application events.

Examples:
- blood_unit_created
- shortage_detected
- transfer_completed
- blood_expiring

==================================================
JOBS & QUEUES
==================================================

Implement:
- BullMQ
- Redis queues
- background jobs

Required jobs:
- expiry monitoring
- shortage monitoring
- analytics aggregation
- donor mobilization
- notification dispatch

==================================================
DOCKER REQUIREMENTS
==================================================

Implement:
- Dockerfiles
- docker-compose
- MongoDB container
- Redis container
- backend container
- nginx container

==================================================
API REQUIREMENTS
==================================================

Build:
- REST APIs
- validation
- pagination
- filtering
- sorting
- rate limiting
- audit logging
- centralized error handling

==================================================
FINAL GOAL
==================================================

The backend must feel like:

“A national healthcare logistics and blood intelligence infrastructure platform.”

NOT:
“A simple blood donation CRUD API.”