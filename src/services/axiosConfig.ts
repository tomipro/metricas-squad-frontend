import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// API Configuration - only base URLs (proxied through Cloudflare Pages)
const ANALYTICS_BASE_URL = process.env.REACT_APP_ANALYTICS_BASE_URL;
const INGEST_BASE_URL = process.env.REACT_APP_INGEST_BASE_URL;

// Debug environment variables in development
if (process.env.NODE_ENV === "development") {
  console.log("Environment variables loaded:", {
    ANALYTICS_BASE_URL: ANALYTICS_BASE_URL ? "✓ Loaded" : "✗ Missing",
    INGEST_BASE_URL: INGEST_BASE_URL ? "✓ Loaded" : "✗ Missing",
  });
}

// Validate required environment variables
if (!ANALYTICS_BASE_URL || !INGEST_BASE_URL) {
  const missingVars = [];
  if (!ANALYTICS_BASE_URL) missingVars.push("REACT_APP_ANALYTICS_BASE_URL");
  if (!INGEST_BASE_URL) missingVars.push("REACT_APP_INGEST_BASE_URL");

  throw new Error(
    `Missing required environment variables: ${missingVars.join(
      ", "
    )}. Please check your .env file and restart the development server.`
  );
}

// Create Analytics API instance
const analyticsApi: AxiosInstance = axios.create({
  baseURL: ANALYTICS_BASE_URL, // Example: /api/analytics
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create Ingest API instance
const ingestApi: AxiosInstance = axios.create({
  baseURL: INGEST_BASE_URL, // Example: /api/ingest
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for Analytics API
analyticsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add timestamp to prevent caching
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
    // Log events for debugging
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
