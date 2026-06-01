import axios from 'axios';

// Since Donor Platform lacks authStore yet, we mock a minimal auth state reader
const getAccessToken = () => localStorage.getItem('donor-auth-token');

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
