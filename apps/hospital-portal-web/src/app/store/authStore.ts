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
  isAuthenticated: !!localStorage.getItem('hospital_token'),
  user: JSON.parse(localStorage.getItem('hospital_user') || 'null'),
  accessToken: localStorage.getItem('hospital_token'),
  
  login: (token, user) => {
    localStorage.setItem('hospital_token', token);
    localStorage.setItem('hospital_user', JSON.stringify(user));
    set({ isAuthenticated: true, user, accessToken: token });
  },
  
  logout: () => {
    localStorage.removeItem('hospital_token');
    localStorage.removeItem('hospital_user');
    set({ isAuthenticated: false, user: null, accessToken: null });
  },
}));
