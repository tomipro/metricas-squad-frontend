import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { login, logout, getUserData, isAuthenticated, LoginRequest, LoginResponse, AuthError } from '../services/authService';
import { useTokenValidation } from '../hooks/useTokenValidation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  nacionalidad?: string;
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enable token validation only when user is authenticated
  useTokenValidation({ 
    enabled: !!user,
    checkInterval: 5 * 60 * 1000 // Check every 5 minutes
  });

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (isAuthenticated()) {
          const userData = getUserData();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: LoginResponse = await login(credentials);
      
      // Transform API response to internal User format
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.nombre_completo,
          role: response.data.user.rol,
          nacionalidad: response.data.user.nacionalidad,
          email_verified: response.data.user.email_verified,
        };
        setUser(userData);
      } else {
        throw new Error(response.message || 'Error de autenticación');
      }
    } catch (err: any) {
      const authError = err as AuthError;
      setError(authError.message || 'Error de autenticación');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = (): void => {
    logout();
    setUser(null);
    setError(null);
  };

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = <div>Cargando...</div> 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
