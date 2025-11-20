import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getHealthStatus,
  getFunnelData,
  getAverageFare,
  getMonthlyRevenue,
  getLifetimeValue,
  getRevenuePerUser,
  getPopularAirlines,
  getUserOrigins,
  getBookingHours,
  getPaymentSuccessRate,
  getCancellationRate,
  getAnticipation,
  getTimeToComplete,
  getSummary,
  getRecentActivity,
  getSearchMetrics,
  getCatalogAirlineSummary,
  getSearchCartSummary,
  getFlightsAircraft,
} from '../services/analyticsService';
import {
  FunnelData,
  AverageFareData,
  MonthlyRevenueData,
  LifetimeValueData,
  RevenuePerUserData,
  PopularAirlinesData,
  UserOriginsData,
  BookingHoursData,
  PaymentSuccessData,
  CancellationRateData,
  AnticipationData,
  TimeToCompleteData,
  SummaryData,
  RecentActivity,
  SearchMetrics,
  CatalogAirlineSummary,
  SearchCartSummary,
  FlightsAircraft,
  OperationsHookReturn,
  AnalyticsHookReturn,
} from '../types/dashboard';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const analyticsKeys = {
  all: ['analytics'] as const,
  health: () => [...analyticsKeys.all, 'health'] as const,
  funnel: (days: number) => [...analyticsKeys.all, 'funnel', days] as const,
  averageFare: (days: number) => [...analyticsKeys.all, 'averageFare', days] as const,
  monthlyRevenue: (months: number) => [...analyticsKeys.all, 'monthlyRevenue', months] as const,
  lifetimeValue: (top: number) => [...analyticsKeys.all, 'lifetimeValue', top] as const,
  revenuePerUser: (days: number, top: number) => [...analyticsKeys.all, 'revenuePerUser', days, top] as const,
  popularAirlines: (days: number, top: number) => [...analyticsKeys.all, 'popularAirlines', days, top] as const,
  userOrigins: (days: number, top: number) => [...analyticsKeys.all, 'userOrigins', days, top] as const,
  bookingHours: (days: number) => [...analyticsKeys.all, 'bookingHours', days] as const,
  paymentSuccess: (days: number) => [...analyticsKeys.all, 'paymentSuccess', days] as const,
  cancellationRate: (days: number) => [...analyticsKeys.all, 'cancellationRate', days] as const,
  anticipation: (days: number) => [...analyticsKeys.all, 'anticipation', days] as const,
  timeToComplete: (days: number) => [...analyticsKeys.all, 'timeToComplete', days] as const,
  summary: (days: number) => [...analyticsKeys.all, 'summary', days] as const,
  recentActivity: (limit: number, hours: number) => [...analyticsKeys.all, 'recentActivity', limit, hours] as const,
  searchMetrics: (days: number, top: number) => [...analyticsKeys.all, 'searchMetrics', days, top] as const,
  catalogAirlineSummary: (days: number, currency: string) => [...analyticsKeys.all, 'catalogAirlineSummary', days, currency] as const,
  searchCartSummary: (days: number, top: number) => [...analyticsKeys.all, 'searchCartSummary', days, top] as const,
  flightsAircraft: (days: number) => [...analyticsKeys.all, 'flightsAircraft', days] as const,
};

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

// Health Check
export const useHealthStatus = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: analyticsKeys.health(),
    queryFn: getHealthStatus,
    staleTime: 30 * 1000, // 30 seconds for health check
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Funnel Data
export const useFunnelData = (days: number = 7): UseQueryResult<FunnelData> => {
  return useQuery({
    queryKey: analyticsKeys.funnel(days),
    queryFn: () => getFunnelData(days),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Average Fare
export const useAverageFare = (days: number = 7): UseQueryResult<AverageFareData> => {
  return useQuery({
    queryKey: analyticsKeys.averageFare(days),
    queryFn: () => getAverageFare(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Monthly Revenue
export const useMonthlyRevenue = (months: number = 6): UseQueryResult<MonthlyRevenueData> => {
  return useQuery({
    queryKey: analyticsKeys.monthlyRevenue(months),
    queryFn: () => getMonthlyRevenue(months),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Lifetime Value
export const useLifetimeValue = (top: number = 10): UseQueryResult<LifetimeValueData> => {
  return useQuery({
    queryKey: analyticsKeys.lifetimeValue(top),
    queryFn: () => getLifetimeValue(top),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Revenue per User
export const useRevenuePerUser = (days: number = 7, top: number = 10): UseQueryResult<RevenuePerUserData> => {
  return useQuery({
    queryKey: analyticsKeys.revenuePerUser(days, top),
    queryFn: () => getRevenuePerUser(days, top),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Popular Airlines
export const usePopularAirlines = (days: number = 7, top: number = 5): UseQueryResult<PopularAirlinesData> => {
  return useQuery({
    queryKey: analyticsKeys.popularAirlines(days, top),
    queryFn: () => getPopularAirlines(days, top),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// User Origins
export const useUserOrigins = (days: number = 7, top: number = 10): UseQueryResult<UserOriginsData> => {
  return useQuery({
    queryKey: analyticsKeys.userOrigins(days, top),
    queryFn: () => getUserOrigins(days, top),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Booking Hours
export const useBookingHours = (days: number = 7): UseQueryResult<BookingHoursData> => {
  return useQuery({
    queryKey: analyticsKeys.bookingHours(days),
    queryFn: () => getBookingHours(days),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Payment Success Rate
export const usePaymentSuccessRate = (days: number = 7): UseQueryResult<PaymentSuccessData> => {
  return useQuery({
    queryKey: analyticsKeys.paymentSuccess(days),
    queryFn: () => getPaymentSuccessRate(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Cancellation Rate
export const useCancellationRate = (days: number = 7): UseQueryResult<CancellationRateData> => {
  return useQuery({
    queryKey: analyticsKeys.cancellationRate(days),
    queryFn: () => getCancellationRate(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Anticipation
export const useAnticipation = (days: number = 90): UseQueryResult<AnticipationData> => {
  return useQuery({
    queryKey: analyticsKeys.anticipation(days),
    queryFn: () => getAnticipation(days),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Time to Complete
export const useTimeToComplete = (days: number = 7): UseQueryResult<TimeToCompleteData> => {
  return useQuery({
    queryKey: analyticsKeys.timeToComplete(days),
    queryFn: () => getTimeToComplete(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// NEW ANALYTICS HOOKS
// =============================================================================

// Summary
export const useSummary = (days: number = 30): UseQueryResult<SummaryData> => {
  return useQuery({
    queryKey: analyticsKeys.summary(days),
    queryFn: () => getSummary(days),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Recent Activity
export const useRecentActivity = (limit: number = 10, hours: number = 24): UseQueryResult<RecentActivity> => {
  return useQuery({
    queryKey: analyticsKeys.recentActivity(limit, hours),
    queryFn: () => getRecentActivity(limit, hours),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Search Metrics
export const useSearchMetrics = (days: number = 14, top: number = 10): UseQueryResult<SearchMetrics> => {
  return useQuery({
    queryKey: analyticsKeys.searchMetrics(days, top),
    queryFn: () => getSearchMetrics(days, top),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Catalog Airline Summary
export const useCatalogAirlineSummary = (days: number = 30, currency: string = 'USD'): UseQueryResult<CatalogAirlineSummary> => {
  return useQuery({
    queryKey: analyticsKeys.catalogAirlineSummary(days, currency),
    queryFn: () => getCatalogAirlineSummary(days, currency),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search Cart Summary
export const useSearchCartSummary = (days: number = 7, top: number = 10): UseQueryResult<SearchCartSummary> => {
  return useQuery({
    queryKey: analyticsKeys.searchCartSummary(days, top),
    queryFn: () => getSearchCartSummary(days, top),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Flights Aircraft
export const useFlightsAircraft = (days: number = 30): UseQueryResult<FlightsAircraft> => {
  return useQuery({
    queryKey: analyticsKeys.flightsAircraft(days),
    queryFn: () => getFlightsAircraft(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =============================================================================
// COMPOSED HOOKS FOR DASHBOARD SECTIONS
// =============================================================================

// Executive Summary Hook
export const useExecutiveSummary = (days: number = 7) => {
  const funnelData = useFunnelData(days);
  const averageFare = useAverageFare(days);
  // Convert days to months (minimum 1 month, round up)
  const months = Math.max(1, Math.ceil(days / 30));
  const monthlyRevenue = useMonthlyRevenue(months);
  const revenuePerUser = useRevenuePerUser(days, 10);
  const paymentSuccess = usePaymentSuccessRate(days);
  const anticipation = useAnticipation(days);

  return {
    funnelData,
    averageFare,
    monthlyRevenue,
    revenuePerUser,
    paymentSuccess,
    anticipation,
    isLoading: [
      funnelData.isLoading,
      averageFare.isLoading,
      monthlyRevenue.isLoading,
      revenuePerUser.isLoading,
      paymentSuccess.isLoading,
      anticipation.isLoading,
    ].some(Boolean),
    isError: [
      funnelData.isError,
      averageFare.isError,
      monthlyRevenue.isError,
      revenuePerUser.isError,
      paymentSuccess.isError,
      anticipation.isError,
    ].some(Boolean),
  };
};

// Operations Hook
export const useOperations = (days: number = 7): OperationsHookReturn => {
  const funnelData = useFunnelData(days);
  const paymentSuccess = usePaymentSuccessRate(days);
  const cancellationRate = useCancellationRate(days);

  return {
    funnelData,
    paymentSuccess,
    cancellationRate,
    isLoading: [
      funnelData.isLoading,
      paymentSuccess.isLoading,
      cancellationRate.isLoading,
    ].some(Boolean),
    isError: [
      funnelData.isError,
      paymentSuccess.isError,
      cancellationRate.isError,
    ].some(Boolean),
  };
};

// Analytics Hook
export const useAnalytics = (days: number = 7): AnalyticsHookReturn => {
  const bookingHours = useBookingHours(days);
  const userOrigins = useUserOrigins(days, 10);
  const paymentSuccess = usePaymentSuccessRate(days);
  const anticipation = useAnticipation(days);

  return {
    bookingHours,
    userOrigins,
    paymentSuccess,
    anticipation,
    isLoading: [
      bookingHours.isLoading,
      userOrigins.isLoading,
      paymentSuccess.isLoading,
      anticipation.isLoading,
    ].some(Boolean),
    isError: [
      bookingHours.isError,
      userOrigins.isError,
      paymentSuccess.isError,
      anticipation.isError,
    ].some(Boolean),
  };
};
