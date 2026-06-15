import { create } from 'zustand';

interface NotificationState {
  expoPushToken: string | null;
  setPushToken: (token: string | null) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  expoPushToken: null,
  setPushToken: (expoPushToken) => set({ expoPushToken }),
}));
