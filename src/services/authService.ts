import axios from 'axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      rol: string;
      nombre_completo: string;
      nacionalidad: string;
      email_verified: boolean;
      created_at: string;
      updated_at: string;
    };
    token: string;
    tokenType: string;
    expiresIn: string;
  };
}

export interface AuthError {
  success: boolean;
  message: string;
  status: number;
}

const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL || 'https://grupo5-usuarios.vercel.app/api/auth';

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to check token validity before making auth requests
authApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
      logoutAndRedirect();
      return Promise.reject(new Error('Token expired'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await authApi.post<LoginResponse>('/login', credentials);
    
    // Check if login was successful
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Handle error response from API
      const errorData = error.response.data;
      const authError: AuthError = {
        success: errorData?.success || false,
        message: errorData?.message || 'Error de autenticación',
        status: error.response.status,
      };
      throw authError;
    } else if (error.request) {
      const authError: AuthError = {
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
      };
      throw authError;
    } else {
      const authError: AuthError = {
        success: false,
        message: 'Error inesperado. Intenta nuevamente.',
        status: 0,
      };
      throw authError;
    }
  }
};

export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

export const logoutAndRedirect = (): void => {
  logout();
  // Only redirect if we're not already on the login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const getUserData = (): any | null => {
  const userData = localStorage.getItem('user_data');
  if (!userData) return null;
  
  try {
    const parsedData = JSON.parse(userData);
    // Transform API format to application format if needed
    // Check if data is in new API format (has 'rol' and 'nombre_completo')
    if (parsedData.rol && parsedData.nombre_completo) {
      return {
        id: parsedData.id,
        email: parsedData.email,
        name: parsedData.nombre_completo,
        role: parsedData.rol,
        nacionalidad: parsedData.nacionalidad,
        email_verified: parsedData.email_verified,
      };
    }
    // Already in application format
    return parsedData;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token || token.length === 0) {
    return false;
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Token is expired, clean up and return false
    logout();
    return false;
  }
  
  return true;
};

export const isValidToken = (token: string): boolean => {
  const parts = token.split('.');
  return parts.length === 3;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Invalid token format
    }

    // Decode the payload (without verification for client-side check)
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token has expiration and if it's expired
    if (payload.exp && payload.exp < currentTime) {
      return true; // Token is expired
    }
    
    return false; // Token is valid
  } catch (error) {
    console.error('Token validation error:', error);
    return true; // Invalid token format or decoding error
  }
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  try {
    const response = await authApi.post<ForgotPasswordResponse>('/forgot-password', { email });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const authError: AuthError = {
        success: false,
        message: error.response.data?.message || 'Error al enviar el email de recuperación',
        status: error.response.status,
      };
      throw authError;
    } else if (error.request) {
      const authError: AuthError = {
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
      };
      throw authError;
    } else {
      const authError: AuthError = {
        success: false,
        message: 'Error inesperado. Intenta nuevamente.',
        status: 0,
      };
      throw authError;
    }
  }
};
