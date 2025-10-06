import { useEffect, useRef } from 'react';
import { getToken, logoutAndRedirect, isTokenExpired } from '../services/authService';

interface UseTokenValidationOptions {
  checkInterval?: number; // in milliseconds
  enabled?: boolean;
}

export const useTokenValidation = (options: UseTokenValidationOptions = {}) => {
  const { checkInterval = 5 * 60 * 1000, enabled = true } = options; // Default: 5 minutes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const validateToken = () => {
    const token = getToken();
    
    if (!token) {
      // No token found, redirect to login
      logoutAndRedirect();
      return;
    }

    if (isTokenExpired(token)) {
      // Token is expired or invalid
      logoutAndRedirect();
      return;
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Initial validation
    validateToken();

    // Set up periodic validation
    intervalRef.current = setInterval(validateToken, checkInterval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkInterval, enabled]);

  return {
    validateToken,
  };
};
