import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../app/store/authStore';

// Singleton socket connection to prevent multiple connections across renders
let socket: Socket | null = null;

export function useRealtime() {
  const { accessToken: token, isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      setIsConnected(false);
      return;
    }
    
    if (!socket) {
      // Connect to the realtime namespace initialized in the backend
      socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket'],
      });
      
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
      socket.on('connect_error', (err) => console.error('Socket connect error:', err));
    }

    return () => {
      // Intentionally not disconnecting on unmount so the socket persists
      // across route changes unless authentication state changes
    };
  }, [isAuthenticated, token]);

  const subscribe = <T,>(event: string, callback: (data: T) => void) => {
    useEffect(() => {
      if (!socket) return;
      socket.on(event, callback);
      return () => {
        socket?.off(event, callback);
      };
    }, [event, callback]);
  };

  const publish = (event: string, payload: any) => {
    if (socket && isConnected) {
      socket.emit(event, payload);
    }
  };

  return { isConnected, subscribe, publish, socket };
}
