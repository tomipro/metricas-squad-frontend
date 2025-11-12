// Tests for useExecutiveSummary hook
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useExecutiveSummary } from '../../hooks/useAnalytics';
import * as analyticsService from '../../services/analyticsService';
import { mockApiResponses } from '../../__mocks__/executiveSummary/mockData';

// Mock the analytics service
jest.mock('../../services/analyticsService');
const mockedAnalyticsService = analyticsService as jest.Mocked<typeof analyticsService>;

// Helper function to create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useExecutiveSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock all the individual service functions
    mockedAnalyticsService.getFunnelData.mockResolvedValue(mockApiResponses.funnel);
    mockedAnalyticsService.getAverageFare.mockResolvedValue(mockApiResponses.averageFare);
    mockedAnalyticsService.getMonthlyRevenue.mockResolvedValue(mockApiResponses.monthlyRevenue);
    mockedAnalyticsService.getLifetimeValue.mockResolvedValue(mockApiResponses.lifetimeValue);
    mockedAnalyticsService.getRevenuePerUser.mockResolvedValue(mockApiResponses.revenuePerUser);
    mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockApiResponses.paymentSuccess);
    mockedAnalyticsService.getAnticipation.mockResolvedValue(mockApiResponses.anticipation);
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useExecutiveSummary(30), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.funnelData.isLoading).toBe(true);
    expect(result.current.averageFare.isLoading).toBe(true);
    expect(result.current.monthlyRevenue.isLoading).toBe(true);
    expect(result.current.revenuePerUser.isLoading).toBe(true);
    expect(result.current.paymentSuccess.isLoading).toBe(true);
    expect(result.current.anticipation.isLoading).toBe(true);
  });

  it('should return success state with data when all queries succeed', async () => {
    const { result } = renderHook(() => useExecutiveSummary(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.funnelData.data).toEqual(mockApiResponses.funnel);
    expect(result.current.averageFare.data).toEqual(mockApiResponses.averageFare);
    expect(result.current.monthlyRevenue.data).toEqual(mockApiResponses.monthlyRevenue);
    expect(result.current.revenuePerUser.data).toEqual(mockApiResponses.revenuePerUser);
    expect(result.current.paymentSuccess.data).toEqual(mockApiResponses.paymentSuccess);
    expect(result.current.anticipation.data).toEqual(mockApiResponses.anticipation);
  });

  it('should return error state when any query fails', async () => {
    mockedAnalyticsService.getFunnelData.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useExecutiveSummary(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.funnelData.isError).toBe(true);
  });

  it('should call service functions with correct parameters', async () => {
    renderHook(() => useExecutiveSummary(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(30);
      expect(mockedAnalyticsService.getAverageFare).toHaveBeenCalledWith(30);
      // For 30 days, months = Math.ceil(30/30) = 1
      expect(mockedAnalyticsService.getMonthlyRevenue).toHaveBeenCalledWith(1);
      expect(mockedAnalyticsService.getLifetimeValue).toHaveBeenCalledWith(10);
      expect(mockedAnalyticsService.getRevenuePerUser).toHaveBeenCalledWith(30, 10);
      expect(mockedAnalyticsService.getPaymentSuccessRate).toHaveBeenCalledWith(30);
      // Anticipation now uses the same days parameter (30) instead of hardcoded 90
      expect(mockedAnalyticsService.getAnticipation).toHaveBeenCalledWith(30);
    });
  });

  it('should handle different days parameter correctly', async () => {
    renderHook(() => useExecutiveSummary(7), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(7);
      expect(mockedAnalyticsService.getAverageFare).toHaveBeenCalledWith(7);
      // For 7 days, months = Math.ceil(7/30) = 1
      expect(mockedAnalyticsService.getMonthlyRevenue).toHaveBeenCalledWith(1);
      expect(mockedAnalyticsService.getRevenuePerUser).toHaveBeenCalledWith(7, 10);
      expect(mockedAnalyticsService.getPaymentSuccessRate).toHaveBeenCalledWith(7);
      // Anticipation now uses the same days parameter (7) instead of hardcoded 90
      expect(mockedAnalyticsService.getAnticipation).toHaveBeenCalledWith(7);
    });
  });

  it('should return partial loading state when some queries are still loading', async () => {
    // Make some queries resolve immediately and others stay loading
    mockedAnalyticsService.getFunnelData.mockResolvedValue(mockApiResponses.funnel);
    mockedAnalyticsService.getAverageFare.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useExecutiveSummary(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.funnelData.data).toEqual(mockApiResponses.funnel);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.averageFare.isLoading).toBe(true);
  });

  it('should return partial error state when some queries fail', async () => {
    mockedAnalyticsService.getFunnelData.mockRejectedValue(new Error('API Error'));
    mockedAnalyticsService.getAverageFare.mockResolvedValue(mockApiResponses.averageFare);

    const { result } = renderHook(() => useExecutiveSummary(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.funnelData.isError).toBe(true);
    expect(result.current.averageFare.data).toEqual(mockApiResponses.averageFare);
  });

  it('should use default parameters when no days provided', async () => {
    renderHook(() => useExecutiveSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(7);
      expect(mockedAnalyticsService.getAverageFare).toHaveBeenCalledWith(7);
    });
  });

  it('should handle empty data responses correctly', async () => {
    const emptyData = {
      period_days: 30,
      searches: 0,
      reservations: 0,
      payments: 0,
      conversion: { search_to_reserve: 0, reserve_to_pay: 0, search_to_pay: 0 },
    };

    mockedAnalyticsService.getFunnelData.mockResolvedValue(emptyData);

    const { result } = renderHook(() => useExecutiveSummary(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.funnelData.data).toEqual(emptyData);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle network errors gracefully', async () => {
    const networkError = new Error('Network Error');
    mockedAnalyticsService.getFunnelData.mockRejectedValue(networkError);

    const { result } = renderHook(() => useExecutiveSummary(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.funnelData.error).toEqual(networkError);
  });
});
