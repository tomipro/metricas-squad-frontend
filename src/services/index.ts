export { analyticsApi, ingestApi, apiRequest } from './axiosConfig';
export * from './analyticsService';
export * from './authService';

export type {
  HealthStatus,
  FunnelData,
  AverageFare,
  MonthlyRevenue,
  LifetimeValue,
  RevenuePerUser,
  PopularAirlines,
  UserOrigins,
  BookingHours,
  PaymentSuccess,
  CancellationRate,
  Anticipation,
  TimeToComplete,
  SummaryData,
  RecentActivity,
  SearchMetrics,
  CatalogAirlineSummary,
  SearchCartSummary,
  FlightsAircraft,
} from './analyticsService';

export type {
  LoginRequest,
  LoginResponse,
  AuthError,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from './authService';
