export { analyticsApi, ingestApi, apiRequest } from './axiosConfig';
export * from './analyticsService';
export * from './ingestService';
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
} from './analyticsService';

export type {
  SearchEvent,
  ReservationEvent,
  PaymentEvent,
  CancellationEvent,
  IngestEvent,
  IngestResponse,
} from './ingestService';

export type {
  LoginRequest,
  LoginResponse,
  AuthError,
} from './authService';
