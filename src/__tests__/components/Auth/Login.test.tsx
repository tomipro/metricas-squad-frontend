// Tests for Login component
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../../components/Auth/Login';
import { useAuth } from '../../../contexts/AuthContext';

// Mock useAuth hook
jest.mock('../../../contexts/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Helper to render with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Component', () => {
  // Default mock implementations
  const mockLogin = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock return value
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: jest.fn(),
      isLoading: false,
      error: null,
      clearError: mockClearError,
      user: null,
      isAuthenticated: false,
    });
  });

  // =============================================================================
  // RENDERING TESTS
  // =============================================================================

  describe('Rendering', () => {
    it('should render the login form with all elements', () => {
      renderWithRouter(<Login />);

      expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByText(/accede a tu panel de métricas/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      // Forgot password functionality has been removed
    });

    it('should render email input with correct attributes', () => {
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'tu@email.com');
      expect(emailInput).not.toBeDisabled();
    });

    it('should render password input with correct attributes', () => {
      renderWithRouter(<Login />);

      const passwordInput = screen.getByLabelText(/contraseña/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
      expect(passwordInput).not.toBeDisabled();
    });

    it('should call clearError on mount', () => {
      renderWithRouter(<Login />);

      expect(mockClearError).toHaveBeenCalledTimes(1);
    });
  });

  // =============================================================================
  // INPUT HANDLING TESTS
  // =============================================================================

  describe('Input Handling', () => {
    it('should update email field when user types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should update password field when user types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const passwordInput = screen.getByLabelText(/contraseña/i);
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('should clear validation errors when input changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Submit empty form to trigger validation errors
      await user.click(submitButton);
      
      // Verify error is shown
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();

      // Type in email field
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 't');

      // Validation error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/el email es requerido/i)).not.toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // VALIDATION TESTS
  // =============================================================================

  describe('Form Validation', () => {
    it('should show error when email is empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(screen.getByText(/el email no es válido/i)).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should show error when password is empty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should show error when password is too short', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '12345'); // Only 5 characters

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(screen.getByText(/la contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should show multiple validation errors simultaneously', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
    });

    it('should add error class to inputs with validation errors', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(emailInput).toHaveClass('error');
      expect(passwordInput).toHaveClass('error');
    });
  });

  // =============================================================================
  // FORM SUBMISSION TESTS
  // =============================================================================

  describe('Form Submission', () => {
    it('should call login with correct credentials on valid submission', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);
      
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should navigate to dashboard after successful login', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);
      
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should call onLoginSuccess callback after successful login', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      mockLogin.mockResolvedValue(undefined);
      
      renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalled();
      });
    });

    it('should not navigate or call callbacks if login fails', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      mockLogin.mockRejectedValue(new Error('Login failed'));
      
      renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });

    it('should prevent default form submission', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);
      
      renderWithRouter(<Login />);

      const form = screen.getByRole('button', { name: /iniciar sesión/i }).closest('form');
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      if (form) {
        form.onsubmit = handleSubmit;
      }

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Handling', () => {
    it('should display error message from auth context', () => {
      const errorMessage = 'Credenciales inválidas';
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        logout: jest.fn(),
        isLoading: false,
        error: errorMessage,
        clearError: mockClearError,
        user: null,
        isAuthenticated: false,
      });

      renderWithRouter(<Login />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should not display error message when error is null', () => {
      renderWithRouter(<Login />);

      const errorMessage = screen.queryByText(/error/i);
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('should log error to console when login fails', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const loginError = new Error('Network error');
      mockLogin.mockRejectedValue(loginError);
      
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Login error:', loginError);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  // =============================================================================
  // LOADING STATE TESTS
  // =============================================================================

  describe('Loading State', () => {
    it('should disable inputs when loading', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        logout: jest.fn(),
        isLoading: true,
        error: null,
        clearError: mockClearError,
        user: null,
        isAuthenticated: false,
      });

      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });

    it('should disable submit button when loading', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        logout: jest.fn(),
        isLoading: true,
        error: null,
        clearError: mockClearError,
        user: null,
        isAuthenticated: false,
      });

      renderWithRouter(<Login />);

      const submitButton = screen.getByRole('button', { name: /iniciando sesión/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading text when loading', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        logout: jest.fn(),
        isLoading: true,
        error: null,
        clearError: mockClearError,
        user: null,
        isAuthenticated: false,
      });

      renderWithRouter(<Login />);

      expect(screen.getByText(/iniciando sesión\.\.\./i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^iniciar sesión$/i })).not.toBeInTheDocument();
    });

    it('should show loading spinner when loading', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        logout: jest.fn(),
        isLoading: true,
        error: null,
        clearError: mockClearError,
        user: null,
        isAuthenticated: false,
      });

      renderWithRouter(<Login />);

      const spinner = document.querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
    });
  });

  // =============================================================================
  // FORGOT PASSWORD TESTS
  // =============================================================================
  // Note: Forgot password functionality has been removed from Login component
  // These tests are commented out as the feature is no longer present
  
  /*
  describe('Forgot Password', () => {
    it('should call onForgotPassword callback when link is clicked', async () => {
      const user = userEvent.setup();
      const mockOnForgotPassword = jest.fn();
      
      renderWithRouter(<Login onForgotPassword={mockOnForgotPassword} />);

      const forgotPasswordButton = screen.getByText(/¿olvidaste tu contraseña\?/i);
      await user.click(forgotPasswordButton);

      expect(mockOnForgotPassword).toHaveBeenCalled();
    });

    it('should not crash if onForgotPassword is not provided', async () => {
      const user = userEvent.setup();
      
      renderWithRouter(<Login />);

      const forgotPasswordButton = screen.getByText(/¿olvidaste tu contraseña\?/i);
      
      expect(async () => {
        await user.click(forgotPasswordButton);
      }).not.toThrow();
    });
  });
  */

  // =============================================================================
  // ACCESSIBILITY TESTS
  // =============================================================================

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderWithRouter(<Login />);

      const emailLabel = screen.getByLabelText(/email/i);
      const passwordLabel = screen.getByLabelText(/contraseña/i);

      expect(emailLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      renderWithRouter(<Login />);

      const heading = screen.getByRole('heading', { name: /iniciar sesión/i });
      expect(heading.tagName).toBe('H1');
    });

    it('should have proper button roles', () => {
      renderWithRouter(<Login />);

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      expect(submitButton).toBeInTheDocument();
      // Forgot password functionality has been removed
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe('Integration', () => {
    it('should complete full login flow', async () => {
      const user = userEvent.setup();
      const mockOnLoginSuccess = jest.fn();
      mockLogin.mockResolvedValue(undefined);
      
      renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);

      // Fill form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/contraseña/i), 'password123');

      // Submit
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Verify flow
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
        expect(mockOnLoginSuccess).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should handle validation error -> fix -> success flow', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue(undefined);
      
      renderWithRouter(<Login />);

      // Submit empty form
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
      
      // Verify validation errors
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();

      // Fix errors
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/contraseña/i), 'password123');

      // Submit again
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      // Verify success
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});

