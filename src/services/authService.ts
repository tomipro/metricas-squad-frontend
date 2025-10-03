import axios from 'axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message: string;
}

export interface AuthError {
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

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await authApi.post<LoginResponse>('/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const authError: AuthError = {
        message: error.response.data?.message || 'Error de autenticación',
        status: error.response.status,
      };
      throw authError;
    } else if (error.request) {
      const authError: AuthError = {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
      };
      throw authError;
    } else {
      const authError: AuthError = {
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

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const getUserData = (): any | null => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token.length > 0;
};

export const isValidToken = (token: string): boolean => {
  const parts = token.split('.');
  return parts.length === 3;
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
