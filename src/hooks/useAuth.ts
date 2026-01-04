import { useAuthStore } from '../store/auth-store';

/**
 * Convenience hook for accessing auth state
 *
 * Usage:
 * ```tsx
 * const { user, isGuest, logout } = useAuth();
 * ```
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const isGuest = useAuthStore((state) => state.isGuest);
  const guestToken = useAuthStore((state) => state.guestToken);
  const isLoading = useAuthStore((state) => state.isLoading);

  const setGuest = useAuthStore((state) => state.setGuest);
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
  const logout = useAuthStore((state) => state.logout);
  const initialize = useAuthStore((state) => state.initialize);

  return {
    // State
    user,
    session,
    isGuest,
    isAuthenticated: !isGuest && !!user,
    guestToken,
    isLoading,

    // Actions
    setGuest,
    setAuthenticatedUser,
    logout,
    initialize,
  };
};
