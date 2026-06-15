import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { PageLoader } from '../components/shared/PageLoader';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { isOnboarded } = useAppStore();

  if (isLoading) {
    return <PageLoader message="Initializing DonorLink..." />;
  }

  if (!isOnboarded) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
