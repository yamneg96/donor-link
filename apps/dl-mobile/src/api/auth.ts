import { apiClient } from './client';
import { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  VerifyOtpRequest,
  RefreshResponse
} from '../types';

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  },
  
  verifyOtp: async (data: VerifyOtpRequest) => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/verify-otp', data);
    return response.data;
  },
  
  sendOtp: async (email: string) => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/send-otp', { email });
    return response.data;
  },
  
  getMe: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
  
  logout: async (refreshToken: string) => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/logout', { refreshToken });
    return response.data;
  },
};
