import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOperations } from '../../hooks/useAnalytics';
import * as analyticsService from '../../services/analyticsService';
import { mockOperationsApiResponses } from '../../__mocks__/operations/mockOperationsData';

// Mock the analytics service
jest.mock('../../services/analyticsService', () => ({
  getFunnelData: jest.fn(),
  getPaymentSuccessRate: jest.fn(),
  getCancellationRate: jest.fn(),
  getPopularAirlines: jest.fn(),
}));

const mockedAnalyticsService = analyticsService as jest.Mocked<typeof analyticsService>;

// Create a wrapper for React Query
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

describe('useOperations Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockedAnalyticsService.getFunnelData.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.funnelData)
    );
    mockedAnalyticsService.getPaymentSuccessRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.paymentSuccess)
    );
    mockedAnalyticsService.getCancellationRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.cancellationRate)
    );
    mockedAnalyticsService.getPopularAirlines.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.popularAirlines)
    );

    const { result } = renderHook(() => useOperations(30), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.funnelData.isLoading).toBe(true);
    expect(result.current.paymentSuccess.isLoading).toBe(true);
    expect(result.current.cancellationRate.isLoading).toBe(true);
    expect(result.current.popularAirlines.isLoading).toBe(true);
  });

  it('should return success state with data', async () => {
    mockedAnalyticsService.getFunnelData.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.funnelData)
    );
    mockedAnalyticsService.getPaymentSuccessRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.paymentSuccess)
    );
    mockedAnalyticsService.getCancellationRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.cancellationRate)
    );
    mockedAnalyticsService.getPopularAirlines.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.popularAirlines)
    );

    const { result } = renderHook(() => useOperations(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.funnelData.data).toEqual(mockOperationsApiResponses.funnelData);
    expect(result.current.paymentSuccess.data).toEqual(mockOperationsApiResponses.paymentSuccess);
    expect(result.current.cancellationRate.data).toEqual(mockOperationsApiResponses.cancellationRate);
    expect(result.current.popularAirlines.data).toEqual(mockOperationsApiResponses.popularAirlines);
  });

  it('should return error state when API calls fail', async () => {
    const error = new Error('API Error');
    mockedAnalyticsService.getFunnelData.mockRejectedValue(error);
    mockedAnalyticsService.getPaymentSuccessRate.mockRejectedValue(error);
    mockedAnalyticsService.getCancellationRate.mockRejectedValue(error);
    mockedAnalyticsService.getPopularAirlines.mockRejectedValue(error);

    const { result } = renderHook(() => useOperations(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.funnelData.isError).toBe(true);
    expect(result.current.paymentSuccess.isError).toBe(true);
    expect(result.current.cancellationRate.isError).toBe(true);
    expect(result.current.popularAirlines.isError).toBe(true);
  });

  it('should handle partial API failures', async () => {
    const error = new Error('API Error');
    mockedAnalyticsService.getFunnelData.mockRejectedValue(error);
    mockedAnalyticsService.getPaymentSuccessRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.paymentSuccess)
    );
    mockedAnalyticsService.getCancellationRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.cancellationRate)
    );
    mockedAnalyticsService.getPopularAirlines.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.popularAirlines)
    );

    const { result } = renderHook(() => useOperations(30), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.funnelData.isError).toBe(true);
    expect(result.current.paymentSuccess.isError).toBe(false);
    expect(result.current.cancellationRate.isError).toBe(false);
    expect(result.current.popularAirlines.isError).toBe(false);
  });

  it('should call API services with correct parameters', () => {
    mockedAnalyticsService.getFunnelData.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.funnelData)
    );
    mockedAnalyticsService.getPaymentSuccessRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.paymentSuccess)
    );
    mockedAnalyticsService.getCancellationRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.cancellationRate)
    );
    mockedAnalyticsService.getPopularAirlines.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.popularAirlines)
    );

    renderHook(() => useOperations(30), {
      wrapper: createWrapper(),
    });

    expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(30);
    expect(mockedAnalyticsService.getPaymentSuccessRate).toHaveBeenCalledWith(30);
    expect(mockedAnalyticsService.getCancellationRate).toHaveBeenCalledWith(30);
    expect(mockedAnalyticsService.getPopularAirlines).toHaveBeenCalledWith(30, 5);
  });

  it('should use default days parameter when not provided', () => {
    mockedAnalyticsService.getFunnelData.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.funnelData)
    );
    mockedAnalyticsService.getPaymentSuccessRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.paymentSuccess)
    );
    mockedAnalyticsService.getCancellationRate.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.cancellationRate)
    );
    mockedAnalyticsService.getPopularAirlines.mockReturnValue(
      Promise.resolve(mockOperationsApiResponses.popularAirlines)
    );

    renderHook(() => useOperations(), {
      wrapper: createWrapper(),
    });

    expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(7);
    expect(mockedAnalyticsService.getPaymentSuccessRate).toHaveBeenCalledWith(7);
    expect(mockedAnalyticsService.getCancellationRate).toHaveBeenCalledWith(7);
    expect(mockedAnalyticsService.getPopularAirlines).toHaveBeenCalledWith(7, 5);
  });
});
