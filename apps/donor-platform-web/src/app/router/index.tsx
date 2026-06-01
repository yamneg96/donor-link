import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import BookingPage from '../../pages/appointments/BookingPage';
import CampaignsPage from '../../pages/campaigns/CampaignsPage';
import LandingPage from '../../pages/landing/LandingPage';
import LoginPage from '../../pages/auth/LoginPage';

// For simplicity in Phase 3 setup, we won't fully protect it with an auth wrapper yet
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/impact', element: <CampaignsPage /> },
      { path: '/donate', element: <BookingPage /> },
      { path: '/centers', element: <BookingPage /> },
      { path: '/profile', element: <DashboardPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
