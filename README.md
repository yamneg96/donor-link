# DonorLink 🩸
### National Blood Infrastructure & Redistribution Intelligence Platform

DonorLink is a production-grade, centralized healthcare logistics, blood inventory orchestration, and emergency coordination platform designed for the Ethiopian National Blood Bank. 

Unlike conventional, simple blood-matching applications, DonorLink acts as an operational control tower. It bridges the gap between blood banks, hospitals, logistics networks, and regional health bureaus across Ethiopia to automate life-saving supply chains and mitigate critical shortages through intelligent data distribution.

---

## 🏛️ Core Architectural Vision

The platform is engineered around the clinical and logistical realities of national health infrastructure, ensuring high availability, zero-flicker dashboard management, and strict audit compliance.

*   **Centralized Logistics Control Tower:** Real-time visibility across national, regional, and hospital-level blood reserves.
*   **Inventory Orchestration:** Automated tracking of blood components (Whole Blood, PRBCs, Platelets, FFP) with automated shelf-life and spoilage alerts.
*   **Redistribution Intelligence:** Predictive routing and cross-facility stock rebalancing to move surplus units to high-demand emergency zones before degradation.
*   **Emergency Coordination Engine:** Rapid multi-channel alerting and dispatch mechanics for critical, zero-negative mass casualty events.

---

## 🎨 Visual Identity & Operational Design

Inspired by modern emergency response rooms, WHO/Red Cross clarity layouts, and aviation control dashboards.

*   **Primary Palette:** 
    *   `Deep Blood Red (#B91C1C)` / `Emergency Crimson` (Critical indicators & branding)
    *   `Hospital Slate (#0F172A / #1E293B)` (Dark ops-center baseline environment)
    *   `Alert Amber` / `Success Green` / `Critical Purple` (Triaged status tags)
*   **Typography:** High-readability modern sans-serif scale (`Manrope` & `Inter`) paired with clean native alignment via `Noto Sans Ethiopic` for local operations localization.

---

## 🚀 Technical Stack

DonorLink is built using a highly scalable, decoupled monorepo architecture engineered for fast edge-rendering and fault-tolerant serverless deployment.

### Frontend Command Center
*   **Core:** React 18+ (TypeScript) via Vite
*   **Styling:** Tailwind CSS (Fluid grid systems, custom operations center aesthetic)
*   **Animations:** GSAP (High-performance, GPU-accelerated interactive data visualization cards)

### Backend Operations API
*   **Runtime Environment:** Node.js (TypeScript) & Express
*   **Database:** MongoDB (MERN Stack structural persistence)
*   **Serverless Optimization:** Custom decoupled Winston logging layers designed natively to navigate read-only cloud container barriers (e.g., Vercel Engine constraints).

---

## 📁 Project Structure

```text
donorlink/
├── apps/
│   ├── web/                     # React + Vite Dashboard Shell
│   │   ├── src/
│   │   │   ├── components/      # UI Cards, Timeline Visualizations, Heatmaps
│   │   │   ├── modules/         # Domain-driven layout interfaces (Inventory, Analytics)
│   │   │   └── main.tsx         # App Mounting Root
│   │   └── index.html           # SEO-optimized, preloaded resource header entry
│   └── api/                     # Express Node Engine
│       ├── src/
│       │   ├── config/          # Logger.ts setups, Environment validation pipelines
│       │   ├── core/            # Middleware blocks (Rate limiters, Global Exception filters)
│       │   ├── modules/         # Domain Sub-Systems (Auth, Blood Transfers, Forecasting)
│       │   ├── app.ts           # Global route mapping & serverless cold-start verification
│       │   └── server.ts        # Standalone bootstrap runtime runner

```

---

## 🔧 Installation & Local Setup

### Prerequisites

* Node.js (v18.x or higher)
* pnpm (Recommended package tool manager)
* MongoDB Instance (Local running daemon or Atlas cloud string)

### Step 1: Clone and Install Dependencies

```bash
git clone [https://github.com/your-organization/donorlink.git](https://github.com/your-organization/donorlink.git)
cd donorlink
pnpm install

```

### Step 2: Configure Environment Variables

Create a `.env` file within the `apps/api/src` directory:

```env
NODE_ENV=development
PORT=8080
LOG_LEVEL=info
LOG_FILE=./logs/app.log
MONGO_URI=mongodb://localhost:27017/donorlink

```

### Step 3: Run the Application Localy

To execute both the API engine and UI development servers concurrently:

```bash
# Start backend API (typically maps onto http://localhost:8080)
cd apps/api
pnpm run dev

# Start frontend UI dashboard (typically maps onto http://localhost:5173)
cd ../web
pnpm run dev

```

---

## ☁️ Deployment Architecture (Serverless Caveats)

When executing production builds targeting serverless engines like **Vercel**, DonorLink intelligently flags runtime environments to adapt core components:

1. **Read-Only File System Handling:** The system automatically bypasses local file system writes (`fs.mkdirSync`). Winston transports dynamically drop local disk append streams (`logs/*.log`) and map errors cleanly to cloud-native `stdout` streams using optimized JSON formatters.
2. **Cold-Start Database Safe Verification:** An initialization middleware catches incoming API requests, guaranteeing live MongoDB state links are established on edge instance awakenings prior to route execution.

---

## 🛡️ Enterprise Security & Accessibility Compliance

* **API Protection:** Wrapped with `helmet` security configurations, contextual strict multi-tenant CORS definitions, and automated rate-limiting protections.
* **A11y Standards:** Root frameworks incorporate dynamic keyboard skip-links allowing field technicians to bypass secondary navigation layout structures directly into live critical alert data zones.