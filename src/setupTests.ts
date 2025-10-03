// Test setup file for Executive Summary tests
import '@testing-library/jest-dom';

// Mock environment variables - using development-like values
process.env.REACT_APP_ANALYTICS_BASE_URL = 'http://localhost:3001/api/analytics';
process.env.REACT_APP_INGEST_BASE_URL = 'http://localhost:3001/api/ingest';
process.env.REACT_APP_AUTH_BASE_URL = 'https://grupo5-usuarios.vercel.app/api/auth';
process.env.REACT_APP_ANALYTICS_API_KEY = 'dev-analytics-key-12345';
process.env.REACT_APP_INGEST_API_KEY = 'dev-ingest-key-67890';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    request: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  default: {
    request: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
