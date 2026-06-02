import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Layouts Placeholder
import AppLayout from '../../layouts/AppLayout';
import { AuthLayout } from '../../layouts/AuthLayout';

// Pages Placeholder
import LandingPage from '@/pages/landing/LandingPage'; // Adjust relative paths to match your layout tree
import { LoginPage } from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import EmergencyPage from '@/pages/emergency/EmergencyPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />, // Open public-facing portal homepage
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'emergency', element: <EmergencyPage /> },
      { path: 'transfers', element: <DashboardPage /> },
      { path: 'donors', element: <DashboardPage /> },
      { path: 'staff', element: <DashboardPage /> },
      { path: 'analytics', element: <DashboardPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/app/dashboard" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}