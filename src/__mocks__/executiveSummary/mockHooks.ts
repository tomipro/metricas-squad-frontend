// Mock implementations for Executive Summary hooks
import { mockApiResponses, mockEmptyApiResponses } from './mockData';

// Helper function to create a complete UseQueryResult mock
const createQueryResult = (isLoading: boolean, isError: boolean, data: any, error: any) => ({
  data,
  error,
  isError,
  isLoading,
  isPending: isLoading,
  isSuccess: !isLoading && !isError,
  isFetching: false,
  isRefetching: false,
  isStale: false,
  isPlaceholderData: false,
  isPreviousData: false,
  isFetched: !isLoading,
  isFetchedAfterMount: !isLoading,
  isRefetchError: false,
  isStaleError: false,
  failureCount: isError ? 1 : 0,
  failureReason: error,
  errorUpdateCount: isError ? 1 : 0,
  isFetchingNextPage: false,
  isFetchingPreviousPage: false,
  hasNextPage: false,
  hasPreviousPage: false,
  fetchNextPage: jest.fn(),
  fetchPreviousPage: jest.fn(),
  refetch: jest.fn(),
  remove: jest.fn(),
  status: isLoading ? 'pending' : isError ? 'error' : 'success',
  fetchStatus: 'idle' as const,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: isError ? Date.now() : 0,
  // Additional properties required by UseQueryResult
  isLoadingError: false,
  isInitialLoading: isLoading,
  isPaused: false,
  isEnabled: true,
  promise: Promise.resolve(data),
} as any);

// Mock useExecutiveSummary hook implementations
export const mockUseExecutiveSummaryLoading = () => ({
  funnelData: createQueryResult(true, false, null, null),
  averageFare: createQueryResult(true, false, null, null),
  monthlyRevenue: createQueryResult(true, false, null, null),
  lifetimeValue: createQueryResult(true, false, null, null),
  revenuePerUser: createQueryResult(true, false, null, null),
  paymentSuccess: createQueryResult(true, false, null, null),
  anticipation: createQueryResult(true, false, null, null),
  isLoading: true,
  isError: false
});

export const mockUseExecutiveSummarySuccess = () => ({
  funnelData: createQueryResult(false, false, mockApiResponses.funnel, null),
  averageFare: createQueryResult(false, false, mockApiResponses.averageFare, null),
  monthlyRevenue: createQueryResult(false, false, mockApiResponses.monthlyRevenue, null),
  lifetimeValue: createQueryResult(false, false, mockApiResponses.lifetimeValue, null),
  revenuePerUser: createQueryResult(false, false, mockApiResponses.revenuePerUser, null),
  paymentSuccess: createQueryResult(false, false, mockApiResponses.paymentSuccess, null),
  anticipation: createQueryResult(false, false, mockApiResponses.anticipation, null),
  isLoading: false,
  isError: false
});

export const mockUseExecutiveSummaryError = () => {
  const apiError = new Error('API Error');
  return {
    funnelData: createQueryResult(false, true, null, apiError),
    averageFare: createQueryResult(false, true, null, apiError),
    monthlyRevenue: createQueryResult(false, true, null, apiError),
    lifetimeValue: createQueryResult(false, true, null, apiError),
    revenuePerUser: createQueryResult(false, true, null, apiError),
    paymentSuccess: createQueryResult(false, true, null, apiError),
    anticipation: createQueryResult(false, true, null, apiError),
    isLoading: false,
    isError: true
  };
};

export const mockUseExecutiveSummaryEmpty = () => ({
  funnelData: createQueryResult(false, false, mockEmptyApiResponses.funnel, null),
  averageFare: createQueryResult(false, false, mockEmptyApiResponses.averageFare, null),
  monthlyRevenue: createQueryResult(false, false, mockEmptyApiResponses.monthlyRevenue, null),
  lifetimeValue: createQueryResult(false, false, mockEmptyApiResponses.lifetimeValue, null),
  revenuePerUser: createQueryResult(false, false, mockEmptyApiResponses.revenuePerUser, null),
  paymentSuccess: createQueryResult(false, false, mockEmptyApiResponses.paymentSuccess, null),
  anticipation: createQueryResult(false, false, mockEmptyApiResponses.anticipation, null),
  isLoading: false,
  isError: false
});

export const mockUseExecutiveSummaryPartialError = () => {
  const apiError = new Error('API Error');
  return {
    funnelData: createQueryResult(false, false, mockApiResponses.funnel, null),
    averageFare: createQueryResult(false, true, null, apiError),
    monthlyRevenue: createQueryResult(false, false, mockApiResponses.monthlyRevenue, null),
    lifetimeValue: createQueryResult(false, true, null, apiError),
    revenuePerUser: createQueryResult(false, false, mockApiResponses.revenuePerUser, null),
    paymentSuccess: createQueryResult(false, false, mockApiResponses.paymentSuccess, null),
    anticipation: createQueryResult(false, false, mockApiResponses.anticipation, null),
    isLoading: false,
    isError: true // Overall error if any sub-hook has an error
  };
};

export const mockUseExecutiveSummaryPartialLoading = () => ({
  funnelData: createQueryResult(false, false, mockApiResponses.funnel, null),
  averageFare: createQueryResult(true, false, null, null),
  monthlyRevenue: createQueryResult(false, false, mockApiResponses.monthlyRevenue, null),
  lifetimeValue: createQueryResult(true, false, null, null),
  revenuePerUser: createQueryResult(false, false, mockApiResponses.revenuePerUser, null),
  paymentSuccess: createQueryResult(true, false, null, null),
  anticipation: createQueryResult(false, false, mockApiResponses.anticipation, null),
  isLoading: true, // Overall loading if any sub-hook is loading
  isError: false
});
