import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;                           // The logged-in user (null if not authenticated)
  login: (username: string, password: string) => Promise<void>; // Perform login and set currentUser
  logout: () => void;                                 // Clear currentUser (logout)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,                              // Initial state: no user is logged in

      // Attempts to log in with username/password against the backend API
      login: async (username, password) => {
        try {
          const response = await fetch('http://localhost:4001/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',     // Send JSON payload
            },
            body: JSON.stringify({ username, password }), // Credentials payload
          });

          // Parse JSON response from the server
          const result = await response.json();

          // If HTTP not OK or API indicates failure, throw to be caught by caller
          if (!response.ok || !result.success) {
            throw new Error(result.message || 'Login failed');
          }

          // On success: store the returned user in the Zustand state
          set({ currentUser: result.user });
        } catch (error) {
          // Log and rethrow so UI can handle (e.g., show toast/message)
          console.error('Login error:', error);
          throw error;
        }
      },

      // Logs out by clearing the current user from state
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'auth-storage',                           // localStorage key used by persist
      partialize: (state) => ({ currentUser: state.currentUser }), // Persist only currentUser
    }
  )
);