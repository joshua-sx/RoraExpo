import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  isGuest: boolean;
  guestToken: string | null;
  isLoading: boolean;

  // Actions
  setGuest: (guestToken: string) => void;
  setAuthenticatedUser: (user: User, session: Session) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      isGuest: true,
      guestToken: null,
      isLoading: true,

      // Set guest mode
      setGuest: (guestToken: string) => {
        set({
          isGuest: true,
          guestToken,
          user: null,
          session: null,
        });
      },

      // Set authenticated user
      setAuthenticatedUser: (user: User, session: Session) => {
        set({
          isGuest: false,
          user,
          session,
          guestToken: null, // Clear guest token when authenticated
        });
      },

      // Logout
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            session: null,
            isGuest: true,
          });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },

      // Initialize auth state from Supabase session
      initialize: async () => {
        try {
          set({ isLoading: true });

          // Get current session from Supabase
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error('Failed to get session:', error);
            set({ isLoading: false });
            return;
          }

          if (session?.user) {
            // User is authenticated
            set({
              user: session.user,
              session,
              isGuest: false,
              guestToken: null,
              isLoading: false,
            });
          } else {
            // User is guest (guest token handled by useGuestToken hook)
            set({
              user: null,
              session: null,
              isGuest: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: '@rora/auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist non-sensitive data
      partialize: (state) => ({
        isGuest: state.isGuest,
        // Don't persist tokens or sessions (handled by Supabase)
      }),
    }
  )
);

// Setup auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  const store = useAuthStore.getState();

  if (event === 'SIGNED_IN' && session?.user) {
    store.setAuthenticatedUser(session.user, session);
  } else if (event === 'SIGNED_OUT') {
    store.logout();
  } else if (event === 'TOKEN_REFRESHED' && session) {
    store.setAuthenticatedUser(session.user, session);
  }
});
