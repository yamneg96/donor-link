import { QueryClient, MutationCache } from '@tanstack/react-query';
import { Alert } from 'react-native';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Something went wrong';
      Alert.alert('Error', message);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
