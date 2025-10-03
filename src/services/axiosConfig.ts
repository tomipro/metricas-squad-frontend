import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// API Configuration - base URLs + keys (direct from env)
const ANALYTICS_BASE_URL = process.env.REACT_APP_ANALYTICS_BASE_URL;
const INGEST_BASE_URL = process.env.REACT_APP_INGEST_BASE_URL;
const ANALYTICS_API_KEY = process.env.REACT_APP_ANALYTICS_API_KEY;
const INGEST_API_KEY = process.env.REACT_APP_INGEST_API_KEY;

// Debug environment variables in development
if (process.env.NODE_ENV === "development") {
  console.log("Environment variables loaded:", {
    ANALYTICS_BASE_URL: ANALYTICS_BASE_URL ? "✓ Loaded" : "✗ Missing",
    INGEST_BASE_URL: INGEST_BASE_URL ? "✓ Loaded" : "✗ Missing",
    ANALYTICS_API_KEY: ANALYTICS_API_KEY ? "✓ Loaded" : "✗ Missing",
    INGEST_API_KEY: INGEST_API_KEY ? "✓ Loaded" : "✗ Missing",
  });
}

// Validate required environment variables with console warning instead of throwing error
const validateEnvVars = () => {
  const missingVars = [];
  if (!ANALYTICS_BASE_URL) missingVars.push("REACT_APP_ANALYTICS_BASE_URL");
  if (!INGEST_BASE_URL) missingVars.push("REACT_APP_INGEST_BASE_URL");
  if (!ANALYTICS_API_KEY) missingVars.push("REACT_APP_ANALYTICS_API_KEY");
  if (!INGEST_API_KEY) missingVars.push("REACT_APP_INGEST_API_KEY");

  if (missingVars.length > 0) {
    console.error(
      `⚠️ Missing required environment variables: ${missingVars.join(", ")}`
    );
    console.error(
      "Please check your .env file and restart the development server."
    );
    return false;
  }
  return true;
};

// Check if env vars are valid
const envVarsValid = validateEnvVars();

// Create Analytics API instance with fallback values
const analyticsApi: AxiosInstance = axios.create({
  baseURL: ANALYTICS_BASE_URL || 'http://localhost:3001/analytics',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": ANALYTICS_API_KEY || 'fallback-key',
  },
});

// Create Ingest API instance with fallback values
const ingestApi: AxiosInstance = axios.create({
  baseURL: INGEST_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": INGEST_API_KEY || 'fallback-key',
  },
});

// Request interceptor for Analytics API
analyticsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Request interceptor for Ingest API
ingestApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Ingesting event:", config.data);
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor for both APIs
const responseInterceptor = (response: AxiosResponse) => {
  if (process.env.NODE_ENV === "development") {
    console.log("API Response:", response.config.url, response.data);
  }
  return response;
};

const errorInterceptor = (error: any) => {
  console.error("API Error:", {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message,
    data: error.response?.data,
  });

  const transformedError = {
    message:
      error.response?.data?.message || error.message || "An error occurred",
    status: error.response?.status,
    data: error.response?.data,
  };

  return Promise.reject(transformedError);
};

// Apply interceptors
analyticsApi.interceptors.response.use(responseInterceptor, errorInterceptor);
ingestApi.interceptors.response.use(responseInterceptor, errorInterceptor);

// Generic API request wrapper
export const apiRequest = async <T>(
  apiInstance: AxiosInstance,
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiInstance.request<T>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export API instances for direct use
export { analyticsApi, ingestApi };
