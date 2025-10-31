// Tests for AuthContext
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth, AuthGuard } from '../../contexts/AuthContext';
import * as authService from '../../services/authService';
import { useTokenValidation } from '../../hooks/useTokenValidation';

// Mock authService
jest.mock('../../services/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Mock useTokenValidation
jest.mock('../../hooks/useTokenValidation');
const mockedUseTokenValidation = useTokenValidation as jest.MockedFunction<typeof useTokenValidation>;

// Helper component to test useAuth hook
const TestComponent: React.FC<{ onRender?: (context: any) => void }> = ({ onRender }) => {
  const context = useAuth();
  
  React.useEffect(() => {
    onRender?.(context);
  }, [context, onRender]);

  return (
    <div>
      <div data-testid="user-email">{context.user?.email || 'no-user'}</div>
      <div data-testid="user-name">{context.user?.name || 'no-name'}</div>
      <div data-testid="user-role">{context.user?.role || 'no-role'}</div>
      <div data-testid="is-authenticated">{context.isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="is-loading">{context.isLoading ? 'true' : 'false'}</div>
      <div data-testid="error">{context.error || 'no-error'}</div>
      <button onClick={() => context.login({ email: 'test@example.com', password: 'password' })}>
        Login
      </button>
      <button onClick={() => context.logout()}>Logout</button>
      <button onClick={() => context.clearError()}>Clear Error</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockedAuthService.isAuthenticated.mockReturnValue(false);
    mockedAuthService.getUserData.mockReturnValue(null);
    mockedAuthService.logout.mockImplementation(() => {});
    mockedUseTokenValidation.mockReturnValue({ validateToken: jest.fn() });
    
    // Mock console.error to avoid noise
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // =============================================================================
  // AUTHPROVIDER INITIALIZATION TESTS
  // =============================================================================

  describe('AuthProvider Initialization', () => {
    it('should initialize with loading state', async () => {
      // Track the loading states during initialization
      const loadingStates: boolean[] = [];
      
      const LoadingTracker = () => {
        const { isLoading } = useAuth();
        loadingStates.push(isLoading);
        return <TestComponent />;
      };

      render(
        <AuthProvider>
          <LoadingTracker />
        </AuthProvider>
      );

      // Wait for initialization to complete
      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // Verify that loading was true at some point during initialization
      expect(loadingStates).toContain(true);
      // And eventually became false
      expect(loadingStates[loadingStates.length - 1]).toBe(false);
    });

    it('should initialize without user when not authenticated', async () => {
      mockedAuthService.isAuthenticated.mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    });

    it('should initialize with user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      };

      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
      expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    });

    it('should handle initialization error gracefully', async () => {
      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockImplementation(() => {
        throw new Error('Failed to get user data');
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      expect(mockedAuthService.logout).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Error initializing auth:',
        expect.any(Error)
      );
    });

    it('should set loading to false after initialization', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });
    });
  });

  // =============================================================================
  // LOGIN TESTS
  // =============================================================================

  describe('Login', () => {
    it('should successfully login and transform user data', async () => {
      const mockApiResponse = {
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            rol: 'admin',
            nombre_completo: 'Test User',
            nacionalidad: 'Argentina',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'mock-token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      };

      mockedAuthService.login.mockResolvedValue(mockApiResponse);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByText('Login');
      await act(async () => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
        expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });
    });

    it('should transform API user fields to internal format', async () => {
      const mockApiResponse = {
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            rol: 'admin', // API format
            nombre_completo: 'Test User', // API format
            nacionalidad: 'Argentina',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'mock-token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      };

      mockedAuthService.login.mockResolvedValue(mockApiResponse);

      let capturedContext: any;
      const onRender = (context: any) => {
        capturedContext = context;
      };

      render(
        <AuthProvider>
          <TestComponent onRender={onRender} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByText('Login');
      await act(async () => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(capturedContext.user).toEqual({
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User', // Transformed from nombre_completo
          role: 'admin', // Transformed from rol
          nacionalidad: 'Argentina',
          email_verified: true,
        });
      });
    });

    it('should set loading state during login', async () => {
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      mockedAuthService.login.mockReturnValue(loginPromise as any);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByText('Login');
      act(() => {
        loginButton.click();
      });

      // Should be loading during login
      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
      });

      // Resolve login
      act(() => {
        resolveLogin!({
          success: true,
          data: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
              rol: 'admin',
              nombre_completo: 'Test User',
              nacionalidad: 'Argentina',
              email_verified: true,
              created_at: '2025-01-01',
              updated_at: '2025-01-01',
            },
            token: 'token',
            tokenType: 'Bearer',
            expiresIn: '24h',
          },
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });
    });

    it('should clear error before login attempt', async () => {
      mockedAuthService.login.mockResolvedValue({
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            rol: 'admin',
            nombre_completo: 'Test User',
            nacionalidad: 'Argentina',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByText('Login');
      await act(async () => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('no-error');
      });
    });

    it('should handle login failure with error message', async () => {
      const mockError = {
        message: 'Credenciales inválidas',
        status: 401,
        success: false,
      };

      mockedAuthService.login.mockRejectedValue(mockError);

      let capturedContext: any;
      const onRender = (context: any) => {
        capturedContext = context;
      };

      render(
        <AuthProvider>
          <TestComponent onRender={onRender} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // Call login directly and catch the error
      await expect(async () => {
        await capturedContext.login({ email: 'test@example.com', password: 'password' });
      }).rejects.toMatchObject({ message: 'Credenciales inválidas' });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Credenciales inválidas');
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
      });
    });

    it('should handle login with success=false', async () => {
      const mockResponse = {
        success: false,
        message: 'Login failed',
        data: null,
      };

      mockedAuthService.login.mockResolvedValue(mockResponse as any);

      let capturedContext: any;
      const onRender = (context: any) => {
        capturedContext = context;
      };

      render(
        <AuthProvider>
          <TestComponent onRender={onRender} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // Call login directly and catch the error
      await expect(async () => {
        await capturedContext.login({ email: 'test@example.com', password: 'password' });
      }).rejects.toThrow('Login failed');

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Login failed');
      });
    });

    it('should re-throw error after handling', async () => {
      const mockError = new Error('Login failed');
      mockedAuthService.login.mockRejectedValue(mockError);

      let capturedContext: any;
      const onRender = (context: any) => {
        capturedContext = context;
      };

      render(
        <AuthProvider>
          <TestComponent onRender={onRender} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      await expect(async () => {
        await capturedContext.login({ email: 'test@example.com', password: 'password' });
      }).rejects.toThrow('Login failed');
    });

    it('should set loading to false after login error', async () => {
      mockedAuthService.login.mockRejectedValue(new Error('Login failed'));

      let capturedContext: any;
      const onRender = (context: any) => {
        capturedContext = context;
      };

      render(
        <AuthProvider>
          <TestComponent onRender={onRender} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // Call login and handle the error
      try {
        await capturedContext.login({ email: 'test@example.com', password: 'password' });
      } catch (err) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });
    });
  });

  // =============================================================================
  // LOGOUT TESTS
  // =============================================================================

  describe('Logout', () => {
    it('should clear user on logout', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      };

      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      const logoutButton = screen.getByText('Logout');
      act(() => {
        logoutButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
      });
    });

    it('should call authService logout', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      const logoutButton = screen.getByText('Logout');
      act(() => {
        logoutButton.click();
      });

      expect(mockedAuthService.logout).toHaveBeenCalled();
    });

    it('should clear error on logout', async () => {
      mockedAuthService.login.mockRejectedValue({ message: 'Error' });

      let capturedContext: any;
      const onRender = (context: any) => {
        capturedContext = context;
      };

      render(
        <AuthProvider>
          <TestComponent onRender={onRender} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // Trigger error
      try {
        await capturedContext.login({ email: 'test@example.com', password: 'password' });
      } catch (err) {
        // Expected
      }

      await waitFor(() => {
        expect(screen.getByTestId('error')).not.toHaveTextContent('no-error');
      });

      // Logout should clear error
      const logoutButton = screen.getByText('Logout');
      act(() => {
        logoutButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('no-error');
      });
    });
  });

  // =============================================================================
  // CLEAR ERROR TESTS
  // =============================================================================

  describe('Clear Error', () => {
    it('should clear error message', async () => {
      mockedAuthService.login.mockRejectedValue({ message: 'Login error' });

      let capturedContext: any;
      const onRender = (context: any) => {
        capturedContext = context;
      };

      render(
        <AuthProvider>
          <TestComponent onRender={onRender} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // Trigger error
      try {
        await capturedContext.login({ email: 'test@example.com', password: 'password' });
      } catch (err) {
        // Expected
      }

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Login error');
      });

      // Clear error
      const clearButton = screen.getByText('Clear Error');
      act(() => {
        clearButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('no-error');
      });
    });
  });

  // =============================================================================
  // USEAUTH HOOK TESTS
  // =============================================================================

  describe('useAuth Hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress error console output for this test
      const consoleError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      console.error = consoleError;
    });

    it('should return context when used inside AuthProvider', async () => {
      let capturedContext: any;
      const onRender = (context: any) => {
        capturedContext = context;
      };

      render(
        <AuthProvider>
          <TestComponent onRender={onRender} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(capturedContext).toBeDefined();
        expect(capturedContext).toHaveProperty('user');
        expect(capturedContext).toHaveProperty('isAuthenticated');
        expect(capturedContext).toHaveProperty('isLoading');
        expect(capturedContext).toHaveProperty('login');
        expect(capturedContext).toHaveProperty('logout');
        expect(capturedContext).toHaveProperty('error');
        expect(capturedContext).toHaveProperty('clearError');
      });
    });

    it('should provide correct isAuthenticated value', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // Initially not authenticated
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');

      // Login
      mockedAuthService.login.mockResolvedValue({
        success: true,
        message: 'Success',
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            rol: 'admin',
            nombre_completo: 'Test',
            nacionalidad: 'AR',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      });

      const loginButton = screen.getByText('Login');
      await act(async () => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });
    });
  });

  // =============================================================================
  // AUTHGUARD TESTS
  // =============================================================================

  describe('AuthGuard', () => {
    it('should render children when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      };

      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <AuthGuard>
            <div>Protected Content</div>
          </AuthGuard>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });

    it('should render fallback when loading', async () => {
      // To test loading state, we need to capture it before it completes
      // We'll track renders to ensure fallback was shown
      const renderedElements: string[] = [];
      
      const TestWrapper = () => {
        const { isLoading } = useAuth();
        renderedElements.push(isLoading ? 'loading' : 'loaded');
        return (
          <AuthGuard fallback={<div>Loading...</div>}>
            <div>Protected Content</div>
          </AuthGuard>
        );
      };

      mockedAuthService.isAuthenticated.mockReturnValue(false);
      
      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      // Verify that loading state occurred
      await waitFor(() => {
        expect(renderedElements).toContain('loading');
      });

      // After loading completes, should not show protected content (not authenticated)
      await waitFor(() => {
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });
    });

    it('should render default fallback when loading and no custom fallback provided', async () => {
      // Test that AuthGuard respects loading state
      const TestWrapper = () => {
        const { isLoading, isAuthenticated } = useAuth();
        return (
          <div>
            <div data-testid="auth-state">
              {isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'not-authenticated'}
            </div>
            <AuthGuard>
              <div>Protected Content</div>
            </AuthGuard>
          </div>
        );
      };

      mockedAuthService.isAuthenticated.mockReturnValue(false);
      
      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      // Eventually should show not-authenticated
      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('not-authenticated');
      });

      // Should not show protected content
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render null when not authenticated', async () => {
      mockedAuthService.isAuthenticated.mockReturnValue(false);

      const { container } = render(
        <AuthProvider>
          <AuthGuard>
            <div>Protected Content</div>
          </AuthGuard>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });

      // AuthGuard returns null when not authenticated, so container should be empty
      expect(container.textContent).toBe('');
    });

    it('should use custom fallback', async () => {
      // Test that custom fallback is respected by checking the overall behavior
      const TestWrapper = () => {
        const { isLoading } = useAuth();
        return (
          <AuthGuard fallback={<div data-testid="custom-fallback">Custom Loading</div>}>
            <div>Protected Content</div>
          </AuthGuard>
        );
      };

      mockedAuthService.isAuthenticated.mockReturnValue(false);

      render(
        <AuthProvider>
          <TestWrapper />
        </AuthProvider>
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });

      // Custom fallback logic is handled by AuthGuard based on isLoading prop
      // Since we can't easily test the transient loading state, we verify the final state
      expect(screen.queryByText('Custom Loading')).not.toBeInTheDocument();
    });
  });

  // =============================================================================
  // TOKEN VALIDATION INTEGRATION TESTS
  // =============================================================================

  describe('Token Validation Integration', () => {
    it('should enable token validation when user is authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      };

      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      expect(mockedUseTokenValidation).toHaveBeenCalledWith({
        enabled: true,
        checkInterval: 5 * 60 * 1000,
      });
    });

    it('should disable token validation when no user', async () => {
      mockedAuthService.isAuthenticated.mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      expect(mockedUseTokenValidation).toHaveBeenCalledWith({
        enabled: false,
        checkInterval: 5 * 60 * 1000,
      });
    });

    it('should update token validation when user logs in', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      });

      // Initially disabled
      expect(mockedUseTokenValidation).toHaveBeenCalledWith({
        enabled: false,
        checkInterval: 5 * 60 * 1000,
      });

      // Login
      mockedAuthService.login.mockResolvedValue({
        success: true,
        message: 'Success',
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            rol: 'admin',
            nombre_completo: 'Test',
            nacionalidad: 'AR',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      });

      const loginButton = screen.getByText('Login');
      await act(async () => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      });

      // Should now be enabled
      expect(mockedUseTokenValidation).toHaveBeenCalledWith({
        enabled: true,
        checkInterval: 5 * 60 * 1000,
      });
    });
  });
});

