import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest, VerifyOtpRequest } from '../types';
import { storage, StorageKeys } from '../services/storage';

export const useLogin = () => {
  const { setTokens, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response) => {
      const { tokens, user } = response.data;
      await storage.setItem(StorageKeys.ACCESS_TOKEN, tokens.accessToken);
      await storage.setItem(StorageKeys.REFRESH_TOKEN, tokens.refreshToken);
      await storage.setItem(StorageKeys.USER, user);
      
      setTokens(tokens);
      setUser(user);
      queryClient.setQueryData(['me'], user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
};

export const useVerifyOtp = () => {
  const { setTokens, setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => authApi.verifyOtp(data),
    onSuccess: async (response) => {
      if (response.data.tokens) {
        const { tokens, user } = response.data;
        await storage.setItem(StorageKeys.ACCESS_TOKEN, tokens.accessToken);
        await storage.setItem(StorageKeys.REFRESH_TOKEN, tokens.refreshToken);
        await storage.setItem(StorageKeys.USER, user);
        setTokens(tokens);
        setUser(user);
      }
    },
  });
};

export const useMe = (enabled = true) => {
  const { setUser, setAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.getMe(),
    enabled,
  });
};
