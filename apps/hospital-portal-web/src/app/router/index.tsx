import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Layouts Placeholder
import AppLayout from '../../layouts/AppLayout';
import { AuthLayout } from '../../layouts/AuthLayout';

// Pages Placeholder
import { LoginPage } from '../../pages/auth/LoginPage';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import InventoryPage from '../../pages/inventory/InventoryPage';
import EmergencyPage from '../../pages/emergency/EmergencyPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'emergency', element: <EmergencyPage /> },
      // Fallbacks mapped to Dashboard to avoid dead routing paths for nav links
      { path: 'transfers', element: <DashboardPage /> },
      { path: 'donors', element: <DashboardPage /> },
      { path: 'staff', element: <DashboardPage /> },
      { path: 'analytics', element: <DashboardPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
