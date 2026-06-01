import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import BookingPage from '../../pages/appointments/BookingPage';
import CampaignsPage from '../../pages/campaigns/CampaignsPage';
import LandingPage from '../../pages/landing/LandingPage';
import LoginPage from '../../pages/auth/LoginPage';
import { EmergencyPage } from '@/pages/emergency/EmergencyPage';
import CenterPage from '@/pages/center/CenterPage';
import ImpactPage from '@/pages/Impact/ImpactPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import EligibilityPage from '@/pages/Eligibility/EligibilityPage';
import CommunityPage from '@/pages/Community/CommunityPage';

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
      { path: '/impact', element: <ImpactPage /> },
      { path: '/campaign', element: <CampaignsPage /> },
      { path: '/donate', element: <BookingPage /> },
      { path: '/emergency', element: <EmergencyPage /> },
      { path: '/centers', element: <CenterPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/eligible', element: <EligibilityPage /> },
      { path: '/community', element: <CommunityPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
