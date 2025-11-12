import { UseQueryResult } from '@tanstack/react-query';

// Dashboard Types - Professional TypeScript definitions

export interface MetricData {
  title: string;
  value: string;
  unit?: string;
  change: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, row?: TableData) => React.ReactNode;
}

export interface TableData {
  [key: string]: string | number | boolean;
}

// Import API Response Types from analyticsService to avoid duplication
import type {
  FunnelData,
  AverageFare,
  MonthlyRevenue,
  LifetimeValue,
  RevenuePerUser,
  PaymentSuccess,
  Anticipation,
  BookingHours,
  UserOrigins,
  PopularAirlines,
  CancellationRate,
  TimeToComplete,
  SummaryData,
  RecentActivity,
  SearchMetrics,
  CatalogAirlineSummary,
  SearchCartSummary,
  FlightsAircraft,
} from '../services/analyticsService';

// Re-export with consistent naming
export type { FunnelData };
export type AverageFareData = AverageFare;
export type MonthlyRevenueData = MonthlyRevenue;
export type LifetimeValueData = LifetimeValue;
export type RevenuePerUserData = RevenuePerUser;
export type PaymentSuccessData = PaymentSuccess;
export type AnticipationData = Anticipation;
export type BookingHoursData = BookingHours;
export type UserOriginsData = UserOrigins;
export type PopularAirlinesData = PopularAirlines;
export type CancellationRateData = CancellationRate;
export type TimeToCompleteData = TimeToComplete;
export type { SummaryData };
export type { RecentActivity };
export type { SearchMetrics };
export type { CatalogAirlineSummary };
export type { SearchCartSummary };
export type { FlightsAircraft };

// Component Props Types
export interface ComponentProps {
  selectedPeriod: string;
}

// Transformed Data Types for UI
export interface TransformedMetricData extends MetricData {}

export interface TransformedChartData extends ChartDataPoint {}

export interface TransformedTableData extends TableData {}


// TanStack Query types are imported at the top

// Specific Hook Return Types
export interface ExecutiveSummaryHookReturn {
  funnelData: UseQueryResult<FunnelData>;
  averageFare: UseQueryResult<AverageFareData>;
  monthlyRevenue: UseQueryResult<MonthlyRevenueData>;
  revenuePerUser: UseQueryResult<RevenuePerUserData>;
  paymentSuccess: UseQueryResult<PaymentSuccessData>;
  anticipation: UseQueryResult<AnticipationData>;
  isLoading: boolean;
  isError: boolean;
}

export interface OperationsHookReturn {
  funnelData: UseQueryResult<FunnelData>;
  paymentSuccess: UseQueryResult<PaymentSuccessData>;
  cancellationRate: UseQueryResult<CancellationRateData>;
  isLoading: boolean;
  isError: boolean;
}

export interface AnalyticsHookReturn {
  bookingHours: UseQueryResult<BookingHoursData>;
  userOrigins: UseQueryResult<UserOriginsData>;
  paymentSuccess: UseQueryResult<PaymentSuccessData>;
  anticipation: UseQueryResult<AnticipationData>;
  isLoading: boolean;
  isError: boolean;
}

export interface PopularAirlinesHookReturn {
  data?: PopularAirlinesData;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}
