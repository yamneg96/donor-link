# Frontend Architecture

The DonorLink web application (`apps/web`) is a highly responsive dashboard for National Admins, Hospital Staff, and Coordinators. Built with **React 19** and **Vite**, it focuses on speed, accessibility, and real-time operations.

## Technology Choices

- **TanStack Router:** Strongly-typed, role-based routing enabling layout persistence and code-splitting.
- **TanStack Query:** Handles complex async state, caching, data synchronization, and optimistic UI updates.
- **Zustand:** Lightweight global state for Session, UI configuration, and RBAC visibility.
- **Tailwind CSS v4 & shadcn/ui:** Styling relies on utility classes augmented by headless Radix primitives for accessibility.
- **Google Maps (`@vis.gl/react-google-maps`):** Powers the Command Center live map, directions, and clustering.

## Folder Structure

```text
src/
├── api/             # Axios instance and endpoints configuration
├── components/
│   ├── layout/      # AppShell, Sidebar, Header, Navigation
│   ├── shared/      # Feature-agnostic (MapRenderer, DataTable, StatCard)
│   ├── modals/      # System-wide dialogs (Confirm, FormModal)
│   └── ui/          # Radix/shadcn primitives
├── hooks/           # Domain-specific Query hooks (useInventory, useTransfers)
├── pages/           # Route components organized by domain
├── router/          # TanStack router config and layout wrappers
├── store/           # Zustand stores (authStore)
├── types/           # Local interface definitions
├── utils/           # Formatting, color scales, etc.
└── main.tsx         # Entry point
```

## Component Paradigms

### Modal System
Modals follow a managed lifecycle using `useModal` hooks. A unified `<FormModal>` wrapper standardizes the presentation of forms, complete with focus trapping and submission state.

### Map Architecture
The Google Map integration strictly decouples logic to avoid re-render loops:
- `GoogleMapMaster`: High-level wrapper providing the Context API.
- `MapRenderer`: Internal component handling Markers, Clusters, and API consumption.
- `MapDirections`: Safely hooks into the async `useMapsLibrary("routes")` to plot optimized logistic paths without crashing on initial mount.

### Routing & Guarding
The application is wrapped in a high-order layout component that blocks unauthenticated access and hides specific module routes (e.g., `/users`, `/organizations`) based on the active user's permissions level defined in `authStore`.
