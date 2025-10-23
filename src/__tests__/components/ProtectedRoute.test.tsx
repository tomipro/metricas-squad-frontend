// Tests for ProtectedRoute
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

// Mock useAuth hook
jest.mock('../../contexts/AuthContext');
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================================================
  // LOADING STATE TESTS
  // =============================================================================

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Verificando autenticación...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should show loading indicator with correct styles', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const loadingContainer = screen.getByText('Verificando autenticación...').parentElement;
      expect(loadingContainer).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      });
    });
  });

  // =============================================================================
  // NOT AUTHENTICATED TESTS
  // =============================================================================

  describe('Not Authenticated', () => {
    it('should redirect to login when user is not authenticated', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            } />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should not render children when not authenticated', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            } />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  // =============================================================================
  // ADMIN ROLE TESTS
  // =============================================================================

  describe('Admin Role Verification', () => {
    it('should allow access for authenticated admin user', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should be case-insensitive for admin role (ADMIN)', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should be case-insensitive for admin role (Admin)', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'Admin',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should deny access for authenticated user role', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should deny access for authenticated guest role', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'guest@example.com',
          name: 'Guest User',
          role: 'guest',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should deny access when user has no role', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'User Without Role',
          role: '',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
    });

    it('should deny access when user is null but authenticated', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // ACCESS DENIED SCREEN TESTS
  // =============================================================================

  describe('Access Denied Screen', () => {
    it('should show access denied message for non-admin users', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('🔒')).toBeInTheDocument();
      expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
      expect(screen.getByText(/Esta plataforma solo está disponible para usuarios con rol de administrador/i)).toBeInTheDocument();
    });

    it('should have a button to return to login', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const button = screen.getByRole('button', { name: /volver al inicio de sesión/i });
      expect(button).toBeInTheDocument();
      
      // Click the button
      button.click();
      
      expect(window.location.href).toBe('/login');
    });

    it('should have correct styles for access denied screen', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const container = screen.getByText('Acceso Denegado').parentElement;
      expect(container).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      });
    });
  });

  // =============================================================================
  // CHILDREN RENDERING TESTS
  // =============================================================================

  describe('Children Rendering', () => {
    it('should render children for authenticated admin users', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should render complex children components', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      const ComplexComponent = () => (
        <div>
          <h1>Dashboard</h1>
          <p>Welcome Admin</p>
          <button>Action</button>
        </div>
      );

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <ComplexComponent />
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome Admin')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Child 1</div>
            <div>Child 2</div>
            <div>Child 3</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration Tests', () => {
    it('should handle complete flow: loading -> authenticated admin -> render content', async () => {
      // Initially loading
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      const { rerender } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Verificando autenticación...')).toBeInTheDocument();

      // Then authenticated as admin
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      rerender(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        expect(screen.queryByText('Verificando autenticación...')).not.toBeInTheDocument();
      });
    });

    it('should handle flow: loading -> authenticated non-admin -> access denied', async () => {
      // Initially loading
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      const { rerender } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Verificando autenticación...')).toBeInTheDocument();

      // Then authenticated as regular user
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        login: jest.fn(),
        logout: jest.fn(),
        error: null,
        clearError: jest.fn(),
      });

      rerender(
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      });
    });
  });
});

