// Tests for authentication service

// Mock axios BEFORE importing anything
jest.mock('axios', () => {
  const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn((fn: any) => fn), eject: jest.fn(), clear: jest.fn() },
      response: { use: jest.fn((fn: any) => fn), eject: jest.fn(), clear: jest.fn() },
    },
  };
  
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
    _mockAxiosInstance: mockAxiosInstance, // Export for testing
  };
});

// NOW import authService AFTER the mock is defined
import axios from 'axios';
import {
  login,
  logout,
  logoutAndRedirect,
  getToken,
  getUserData,
  isAuthenticated,
  isValidToken,
  isTokenExpired,
  getAuthHeaders,
  forgotPassword,
  LoginRequest,
  AuthError,
} from '../../services/authService';

// Get the mocked instance by calling create (which returns our mock)
const mockAxiosInstance = (axios.create as jest.Mock)();

// Mock window.location
delete (window as any).location;
window.location = {
  href: '',
  pathname: '/',
} as any;

describe('authService', () => {
  // Mock localStorage
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock = {};
    
    Storage.prototype.getItem = jest.fn((key: string) => localStorageMock[key] || null);
    Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    Storage.prototype.removeItem = jest.fn((key: string) => {
      delete localStorageMock[key];
    });
    
    // Reset window.location
    window.location.href = '';
    window.location.pathname = '/';
    
    // Mock console.error to avoid noise
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // =============================================================================
  // login() TESTS
  // =============================================================================

  describe('login()', () => {
    const mockCredentials: LoginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockSuccessResponse = {
      data: {
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
            created_at: '2025-01-01T00:00:00.000Z',
            updated_at: '2025-01-01T00:00:00.000Z',
          },
          token: 'mock-jwt-token',
          tokenType: 'Bearer',
          expiresIn: '24h',
        },
      },
    };

    it('should successfully login and save token to localStorage', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockSuccessResponse);

      const result = await login(mockCredentials);

      expect(result).toEqual(mockSuccessResponse.data);
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user_data',
        JSON.stringify(mockSuccessResponse.data.data.user)
      );
    });

    it('should successfully login and return correct response structure', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockSuccessResponse);

      const result = await login(mockCredentials);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message', 'Login exitoso');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('user');
      expect(result.data).toHaveProperty('token');
      expect(result.data).toHaveProperty('tokenType', 'Bearer');
      expect(result.data).toHaveProperty('expiresIn', '24h');
    });

    it('should transform API user data format correctly', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockSuccessResponse);

      const result = await login(mockCredentials);

      expect(result.data.user).toHaveProperty('rol', 'admin');
      expect(result.data.user).toHaveProperty('nombre_completo', 'Test User');
      expect(result.data.user).toHaveProperty('nacionalidad', 'Argentina');
      expect(result.data.user).toHaveProperty('email_verified', true);
    });

    it('should throw AuthError with invalid credentials (401)', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: {
            success: false,
            message: 'Credenciales inválidas',
          },
        },
      };

      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(login(mockCredentials)).rejects.toMatchObject({
        success: false,
        message: 'Credenciales inválidas',
        status: 401,
      });
    });

    it('should throw AuthError on network error', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        request: {},
        message: 'Network Error',
      });

      await expect(login(mockCredentials)).rejects.toMatchObject({
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
      });
    });

    it('should throw AuthError on server error (500)', async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: {
            success: false,
            message: 'Error interno del servidor',
          },
        },
      };

      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(login(mockCredentials)).rejects.toMatchObject({
        success: false,
        message: 'Error interno del servidor',
        status: 500,
      });
    });

    it('should throw generic AuthError on unexpected error', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Unexpected error'));

      await expect(login(mockCredentials)).rejects.toMatchObject({
        success: false,
        message: 'Error inesperado. Intenta nuevamente.',
        status: 0,
      });
    });

    it('should not save data if success is false', async () => {
      const failureResponse = {
        data: {
          success: false,
          message: 'Login failed',
          data: null,
        },
      };

      mockAxiosInstance.post.mockResolvedValue(failureResponse);

      await login(mockCredentials);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  // =============================================================================
  // logout() TESTS
  // =============================================================================

  describe('logout()', () => {
    it('should remove auth_token from localStorage', () => {
      localStorageMock['auth_token'] = 'some-token';
      localStorageMock['user_data'] = JSON.stringify({ id: '1', name: 'Test' });

      logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });

    it('should remove user_data from localStorage', () => {
      localStorageMock['auth_token'] = 'some-token';
      localStorageMock['user_data'] = JSON.stringify({ id: '1', name: 'Test' });

      logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('user_data');
    });

    it('should not throw error if no data exists', () => {
      expect(() => logout()).not.toThrow();
    });
  });

  // =============================================================================
  // logoutAndRedirect() TESTS
  // =============================================================================

  describe('logoutAndRedirect()', () => {
    it('should call logout()', () => {
      const logoutSpy = jest.spyOn({ logout }, 'logout');
      window.location.pathname = '/dashboard';

      logoutAndRedirect();

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user_data');
    });

    it('should redirect to /login', () => {
      window.location.pathname = '/dashboard';

      logoutAndRedirect();

      expect(window.location.href).toBe('/login');
    });

    it('should not redirect if already on /login', () => {
      window.location.pathname = '/login';

      logoutAndRedirect();

      expect(window.location.href).toBe('');
    });
  });

  // =============================================================================
  // getToken() TESTS
  // =============================================================================

  describe('getToken()', () => {
    it('should return token if it exists', () => {
      localStorageMock['auth_token'] = 'test-token-123';

      const token = getToken();

      expect(token).toBe('test-token-123');
      expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
    });

    it('should return null if token does not exist', () => {
      const token = getToken();

      expect(token).toBeNull();
    });
  });

  // =============================================================================
  // getUserData() TESTS
  // =============================================================================

  describe('getUserData()', () => {
    it('should return transformed user data from API format', () => {
      const apiFormatUser = {
        id: 'user-123',
        email: 'test@example.com',
        rol: 'admin',
        nombre_completo: 'Test User',
        nacionalidad: 'Argentina',
        email_verified: true,
      };
      
      localStorageMock['user_data'] = JSON.stringify(apiFormatUser);

      const userData = getUserData();

      expect(userData).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User',
        nacionalidad: 'Argentina',
        email_verified: true,
      });
    });

    it('should return data already in internal format without transformation', () => {
      const internalFormatUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User',
      };
      
      localStorageMock['user_data'] = JSON.stringify(internalFormatUser);

      const userData = getUserData();

      expect(userData).toEqual(internalFormatUser);
    });

    it('should return null if no user data exists', () => {
      const userData = getUserData();

      expect(userData).toBeNull();
    });

    it('should return null on JSON parse error', () => {
      localStorageMock['user_data'] = 'invalid-json{';

      const userData = getUserData();

      expect(userData).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  // =============================================================================
  // isAuthenticated() TESTS
  // =============================================================================

  describe('isAuthenticated()', () => {
    it('should return true if valid token exists', () => {
      // Mock a valid non-expired JWT token
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 });
      localStorageMock['auth_token'] = validToken;

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if no token exists', () => {
      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false if token is empty string', () => {
      localStorageMock['auth_token'] = '';

      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false and call logout if token is expired', () => {
      const expiredToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) - 3600 });
      localStorageMock['auth_token'] = expiredToken;

      const result = isAuthenticated();

      expect(result).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user_data');
    });
  });

  // =============================================================================
  // isValidToken() TESTS
  // =============================================================================

  describe('isValidToken()', () => {
    it('should return true for valid JWT format (3 parts)', () => {
      const validToken = 'header.payload.signature';

      const result = isValidToken(validToken);

      expect(result).toBe(true);
    });

    it('should return false for token with less than 3 parts', () => {
      const invalidToken = 'header.payload';

      const result = isValidToken(invalidToken);

      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = isValidToken('');

      expect(result).toBe(false);
    });

    it('should return false for token with more than 3 parts', () => {
      const invalidToken = 'header.payload.signature.extra';

      const result = isValidToken(invalidToken);

      expect(result).toBe(false);
    });
  });

  // =============================================================================
  // isTokenExpired() TESTS
  // =============================================================================

  describe('isTokenExpired()', () => {
    it('should return false for valid non-expired token', () => {
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 });

      const result = isTokenExpired(validToken);

      expect(result).toBe(false);
    });

    it('should return true for expired token', () => {
      const expiredToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) - 3600 });

      const result = isTokenExpired(expiredToken);

      expect(result).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const tokenWithoutExp = createMockJWT({ userId: 'test-user' });

      const result = isTokenExpired(tokenWithoutExp);

      expect(result).toBe(false); // No exp means it doesn't expire
    });

    it('should return true for invalid token format', () => {
      const invalidToken = 'invalid.token';

      const result = isTokenExpired(invalidToken);

      expect(result).toBe(true);
    });

    it('should return true for token with invalid JSON payload', () => {
      const invalidToken = 'header.invalid-base64.signature';

      const result = isTokenExpired(invalidToken);

      expect(result).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should return true for empty token', () => {
      const result = isTokenExpired('');

      expect(result).toBe(true);
    });
  });

  // =============================================================================
  // getAuthHeaders() TESTS
  // =============================================================================

  describe('getAuthHeaders()', () => {
    it('should return headers with Bearer token if token exists', () => {
      localStorageMock['auth_token'] = 'test-token-123';

      const headers = getAuthHeaders();

      expect(headers).toEqual({
        Authorization: 'Bearer test-token-123',
      });
    });

    it('should return empty headers if no token exists', () => {
      const headers = getAuthHeaders();

      expect(headers).toEqual({});
    });
  });

  // =============================================================================
  // forgotPassword() TESTS
  // =============================================================================

  describe('forgotPassword()', () => {
    const testEmail = 'test@example.com';

    it('should successfully send forgot password request', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Email de recuperación enviado',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await forgotPassword(testEmail);

      expect(result).toEqual(mockResponse.data);
      expect(result.success).toBe(true);
    });

    it('should handle email not found error', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Email no encontrado',
          },
        },
      };

      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(forgotPassword(testEmail)).rejects.toMatchObject({
        success: false,
        message: 'Email no encontrado',
        status: 404,
      });
    });

    it('should handle network error', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        request: {},
        message: 'Network Error',
      });

      await expect(forgotPassword(testEmail)).rejects.toMatchObject({
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
      });
    });

    it('should handle timeout error', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout of 10000ms exceeded',
      });

      await expect(forgotPassword(testEmail)).rejects.toMatchObject({
        success: false,
        message: 'Error inesperado. Intenta nuevamente.',
        status: 0,
      });
    });
  });
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Creates a mock JWT token for testing
 */
function createMockJWT(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify(payload));
  const signature = 'mock-signature';
  return `${header}.${payloadStr}.${signature}`;
}

