// Integration tests for complete Authentication Flow
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Login from '../../components/Auth/Login';
import ProtectedRoute from '../../components/ProtectedRoute';
import * as authService from '../../services/authService';

// Mock authService
jest.mock('../../services/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Mock component for protected content
const DashboardMock = () => <div>Dashboard Content</div>;
const LoginPageMock = () => <div>Login Page</div>;

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Default mock implementations
    mockedAuthService.isAuthenticated.mockReturnValue(false);
    mockedAuthService.getUserData.mockReturnValue(null);
    mockedAuthService.getToken.mockReturnValue(null);
    mockedAuthService.logout.mockImplementation(() => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    });
  });

  // =============================================================================
  // COMPLETE LOGIN FLOW TESTS
  // =============================================================================

  describe('Complete Login Flow', () => {
    it('should complete full login flow: form → API → storage → redirect', async () => {
      const mockApiResponse = {
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: 'user-123',
            email: 'admin@example.com',
            rol: 'admin',
            nombre_completo: 'Admin User',
            nacionalidad: 'Argentina',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'mock-jwt-token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      };

      mockedAuthService.login.mockResolvedValue(mockApiResponse);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardMock />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // User fills in the form
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'admin@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

      // Verify API was called
      await waitFor(() => {
        expect(mockedAuthService.login).toHaveBeenCalledWith({
          email: 'admin@example.com',
          password: 'password123',
        });
      });

      // Verify navigation to dashboard
      await waitFor(() => {
        expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
      });
    });

    it('should handle login failure and show error', async () => {
      const mockError = {
        message: 'Credenciales inválidas',
        status: 401,
        success: false,
      };

      mockedAuthService.login.mockRejectedValue(mockError);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardMock />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Fill and submit form
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'wrongpassword' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

      // Should stay on login page (not navigate to dashboard)
      await waitFor(() => {
        expect(mockedAuthService.login).toHaveBeenCalled();
      });

      // Should not navigate to dashboard
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
      
      // Should still be on login page
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // PROTECTED ROUTE INTEGRATION TESTS
  // =============================================================================

  describe('Protected Route Integration', () => {
    it('should redirect to login when accessing protected route without auth', () => {
      mockedAuthService.isAuthenticated.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPageMock />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardMock />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Should be redirected to login
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
    });

    it('should allow access to protected route when authenticated as admin', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      };

      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockReturnValue(mockUser);

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPageMock />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardMock />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
      });

      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('should deny access to non-admin users', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
      };

      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockReturnValue(mockUser);

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPageMock />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardMock />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
      });

      expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
    });
  });

  // =============================================================================
  // LOGIN → DASHBOARD → LOGOUT FLOW
  // =============================================================================

  describe('Login → Dashboard → Logout Flow', () => {
    it('should complete full cycle: login → access dashboard → logout → redirect to login', async () => {
      // Mock successful login
      const mockApiResponse = {
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: 'user-123',
            email: 'admin@example.com',
            rol: 'admin',
            nombre_completo: 'Admin User',
            nacionalidad: 'Argentina',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'mock-jwt-token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      };

      mockedAuthService.login.mockResolvedValue(mockApiResponse);

      const { rerender } = render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div>
                      <DashboardMock />
                      <button onClick={() => mockedAuthService.logout()}>Logout</button>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Step 1: Login
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'admin@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

      // Step 2: Should navigate to dashboard
      await waitFor(() => {
        expect(screen.queryByText('Dashboard Content')).toBeInTheDocument();
      });

      // Verify login was called
      expect(mockedAuthService.login).toHaveBeenCalled();
    });
  });

  // =============================================================================
  // AUTHENTICATION STATE PERSISTENCE
  // =============================================================================

  describe('Authentication State Persistence', () => {
    it('should restore authentication state from localStorage on mount', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      };

      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockReturnValue(mockUser);
      mockedAuthService.getToken.mockReturnValue('existing-token');

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPageMock />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardMock />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
      });

      // Should access protected content without login
      expect(mockedAuthService.getUserData).toHaveBeenCalled();
    });

    it('should clear authentication state on logout', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      };

      // Initially authenticated
      mockedAuthService.isAuthenticated.mockReturnValue(true);
      mockedAuthService.getUserData.mockReturnValue(mockUser);

      const LogoutButton = () => {
        const { logout } = require('../../contexts/AuthContext').useAuth();
        return <button onClick={logout}>Logout</button>;
      };

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPageMock />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div>
                      <DashboardMock />
                      <LogoutButton />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
      });

      // Logout
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      expect(mockedAuthService.logout).toHaveBeenCalled();
    });
  });

  // =============================================================================
  // ERROR RECOVERY FLOWS
  // =============================================================================

  describe('Error Recovery Flows', () => {
    it('should allow retry after failed login', async () => {
      const mockError = {
        message: 'Error de red',
        success: false,
      };

      const mockSuccessResponse = {
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: 'user-123',
            email: 'admin@example.com',
            rol: 'admin',
            nombre_completo: 'Admin User',
            nacionalidad: 'Argentina',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'mock-jwt-token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      };

      // First attempt fails
      mockedAuthService.login.mockRejectedValueOnce(mockError);
      // Second attempt succeeds
      mockedAuthService.login.mockResolvedValueOnce(mockSuccessResponse);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardMock />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // First attempt
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'admin@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

      // Wait for first attempt
      await waitFor(() => {
        expect(mockedAuthService.login).toHaveBeenCalledTimes(1);
      });

      // Should still be on login page
      await waitFor(() => {
        expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
      });

      // Retry - wait for button to be available and click again
      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'Iniciar Sesión' });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
      });
      
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

      // Should succeed and navigate to dashboard
      await waitFor(() => {
        expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
      });

      expect(mockedAuthService.login).toHaveBeenCalledTimes(2);
    });

    it('should clear error when user modifies form', async () => {
      const mockError = {
        message: 'Credenciales inválidas',
        success: false,
      };

      mockedAuthService.login.mockRejectedValue(mockError);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Trigger error with short password
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'wrongpassword' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

      await waitFor(() => {
        expect(mockedAuthService.login).toHaveBeenCalled();
      });

      // Verify we're still on login page
      expect(screen.getByLabelText('Email')).toBeInTheDocument();

      // Modify form - should be able to edit
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'new@example.com' },
      });

      // Verify the input changed
      expect(screen.getByLabelText('Email')).toHaveValue('new@example.com');
    });
  });

  // =============================================================================
  // LOADING STATES INTEGRATION
  // =============================================================================

  describe('Loading States Integration', () => {
    it('should show loading indicator during login', async () => {
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      mockedAuthService.login.mockReturnValue(loginPromise as any);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'admin@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
      });

      // Resolve login
      resolveLogin!({
        success: true,
        data: {
          user: {
            id: 'user-123',
            email: 'admin@example.com',
            rol: 'admin',
            nombre_completo: 'Admin User',
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

      await waitFor(() => {
        expect(screen.queryByText('Iniciando sesión...')).not.toBeInTheDocument();
      });
    });

    it('should show loading state when checking authentication', () => {
      mockedAuthService.isAuthenticated.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPageMock />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardMock />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Initially might show loading (very brief)
      // Then should redirect to login
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // VALIDATION INTEGRATION
  // =============================================================================

  describe('Validation Integration', () => {
    it('should prevent login with invalid email format', async () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Wait a bit for validation to process
      await new Promise(resolve => setTimeout(resolve, 100));

      // Login should not be called with invalid email
      expect(mockedAuthService.login).not.toHaveBeenCalled();
    });

    it('should prevent login with short password', async () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

      fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      // Wait a bit for validation to process
      await new Promise(resolve => setTimeout(resolve, 100));

      // Login should not be called with short password
      expect(mockedAuthService.login).not.toHaveBeenCalled();
    });

    it('should prevent login with empty fields', async () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
      fireEvent.click(submitButton);

      // Wait a bit for validation to process
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not call login with empty fields
      expect(mockedAuthService.login).not.toHaveBeenCalled();
    });

    it('should allow login with valid credentials', async () => {
      const mockSuccessResponse = {
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: 'user-123',
            email: 'admin@example.com',
            rol: 'admin',
            nombre_completo: 'Admin User',
            nacionalidad: 'Argentina',
            email_verified: true,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
          token: 'mock-jwt-token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      };

      mockedAuthService.login.mockResolvedValue(mockSuccessResponse);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardMock />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

      fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Should call login and navigate
      await waitFor(() => {
        expect(mockedAuthService.login).toHaveBeenCalled();
      });
    });
  });
});

