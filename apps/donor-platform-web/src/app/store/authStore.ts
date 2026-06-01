import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('donor_token'),
  user: JSON.parse(localStorage.getItem('donor_user') || 'null'),
  accessToken: localStorage.getItem('donor_token'),
  
  login: (token, user) => {
    localStorage.setItem('donor_token', token);
    localStorage.setItem('donor_user', JSON.stringify(user));
    set({ isAuthenticated: true, user, accessToken: token });
  },
  
  logout: () => {
    localStorage.removeItem('donor_token');
    localStorage.removeItem('donor_user');
    set({ isAuthenticated: false, user: null, accessToken: null });
  },
}));
