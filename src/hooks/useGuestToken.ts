import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const GUEST_TOKEN_KEY = '@rora/guest_token';
const GUEST_TOKEN_EXPIRY_KEY = '@rora/guest_token_expiry';

interface GuestTokenData {
  token: string;
  expiresAt: string;
}

export const useGuestToken = () => {
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load guest token from AsyncStorage
   */
  const loadGuestToken = async (): Promise<GuestTokenData | null> => {
    try {
      const [token, expiresAt] = await Promise.all([
        AsyncStorage.getItem(GUEST_TOKEN_KEY),
        AsyncStorage.getItem(GUEST_TOKEN_EXPIRY_KEY),
      ]);

      if (token && expiresAt) {
        // Check if token is expired
        const now = new Date();
        const expiry = new Date(expiresAt);

        if (now < expiry) {
          return { token, expiresAt };
        } else {
          // Token expired, clear it
          await clearGuestToken();
          return null;
        }
      }

      return null;
    } catch (err) {
      console.error('Failed to load guest token:', err);
      return null;
    }
  };

  /**
   * Create a new guest token
   */
  const createGuestToken = async (): Promise<GuestTokenData | null> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-guest-token',
        {
          body: {},
        }
      );

      if (error) {
        console.error('Failed to create guest token:', error);
        setError(error.message);
        return null;
      }

      if (data?.success && data?.token) {
        const tokenData: GuestTokenData = {
          token: data.token,
          expiresAt: data.expires_at,
        };

        // Store in AsyncStorage
        await Promise.all([
          AsyncStorage.setItem(GUEST_TOKEN_KEY, tokenData.token),
          AsyncStorage.setItem(GUEST_TOKEN_EXPIRY_KEY, tokenData.expiresAt),
        ]);

        setGuestToken(tokenData.token);
        setError(null);
        return tokenData;
      }

      return null;
    } catch (err) {
      console.error('Failed to create guest token:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  /**
   * Validate guest token with backend
   */
  const validateGuestToken = async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'validate-guest-token',
        {
          body: { token },
        }
      );

      if (error || !data?.valid) {
        console.warn('Guest token validation failed:', error || data);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Failed to validate guest token:', err);
      return false;
    }
  };

  /**
   * Clear guest token from storage
   */
  const clearGuestToken = async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(GUEST_TOKEN_KEY),
        AsyncStorage.removeItem(GUEST_TOKEN_EXPIRY_KEY),
      ]);
      setGuestToken(null);
    } catch (err) {
      console.error('Failed to clear guest token:', err);
    }
  };

  /**
   * Initialize guest token on first load
   */
  useEffect(() => {
    const initializeGuestToken = async () => {
      setIsLoading(true);

      // Try to load existing token
      const existingToken = await loadGuestToken();

      if (existingToken) {
        // Validate with backend
        const isValid = await validateGuestToken(existingToken.token);

        if (isValid) {
          setGuestToken(existingToken.token);
        } else {
          // Token invalid, create new one
          await createGuestToken();
        }
      } else {
        // No token exists, create new one
        await createGuestToken();
      }

      setIsLoading(false);
    };

    initializeGuestToken();
  }, []);

  return {
    guestToken,
    isLoading,
    error,
    createGuestToken,
    validateGuestToken,
    clearGuestToken,
  };
};
