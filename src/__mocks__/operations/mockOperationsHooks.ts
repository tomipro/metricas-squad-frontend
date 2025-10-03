// Mock implementations for Operations tab hooks
// @ts-nocheck
import { 
  mockOperationsApiResponses, 
  mockOperationsEmptyData, 
  mockOperationsErrorResponses 
} from './mockOperationsData';
import { OperationsHookReturn } from '../../types/dashboard';

// Mock useOperations hook implementations
export const mockUseOperationsLoading = (): OperationsHookReturn => ({
  funnelData: { isLoading: true, isError: false, data: null, error: null },
  paymentSuccess: { isLoading: true, isError: false, data: null, error: null },
  timeToComplete: { isLoading: true, isError: false, data: null, error: null },
  cancellationRate: { isLoading: true, isError: false, data: null, error: null },
  popularAirlines: { isLoading: true, isError: false, data: null, error: null },
  isLoading: true,
  isError: false
});

export const mockUseOperationsSuccess = (): OperationsHookReturn => ({
  funnelData: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.funnelData, 
    error: null 
  },
  paymentSuccess: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.paymentSuccess, 
    error: null 
  },
  timeToComplete: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.timeToComplete, 
    error: null 
  },
  cancellationRate: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.cancellationRate, 
    error: null 
  },
  popularAirlines: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.popularAirlines, 
    error: null 
  },
  isLoading: false,
  isError: false
});

export const mockUseOperationsError = (): OperationsHookReturn => ({
  funnelData: { 
    isLoading: false, 
    isError: true, 
    data: null, 
    error: mockOperationsErrorResponses.funnelData 
  },
  paymentSuccess: { 
    isLoading: false, 
    isError: true, 
    data: null, 
    error: mockOperationsErrorResponses.paymentSuccess 
  },
  timeToComplete: { 
    isLoading: false, 
    isError: true, 
    data: null, 
    error: mockOperationsErrorResponses.timeToComplete 
  },
  cancellationRate: { 
    isLoading: false, 
    isError: true, 
    data: null, 
    error: mockOperationsErrorResponses.cancellationRate 
  },
  popularAirlines: { 
    isLoading: false, 
    isError: true, 
    data: null, 
    error: mockOperationsErrorResponses.popularAirlines 
  },
  isLoading: false,
  isError: true
});

export const mockUseOperationsEmpty = (): OperationsHookReturn => ({
  funnelData: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsEmptyData.funnelData, 
    error: null 
  },
  paymentSuccess: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsEmptyData.paymentSuccess, 
    error: null 
  },
  timeToComplete: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsEmptyData.timeToComplete, 
    error: null 
  },
  cancellationRate: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsEmptyData.cancellationRate, 
    error: null 
  },
  popularAirlines: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsEmptyData.popularAirlines, 
    error: null 
  },
  isLoading: false,
  isError: false
});

export const mockUseOperationsPartialError = (): OperationsHookReturn => ({
  funnelData: { 
    isLoading: false, 
    isError: true, 
    data: null, 
    error: mockOperationsErrorResponses.funnelData 
  },
  paymentSuccess: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.paymentSuccess, 
    error: null 
  },
  timeToComplete: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.timeToComplete, 
    error: null 
  },
  cancellationRate: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.cancellationRate, 
    error: null 
  },
  popularAirlines: { 
    isLoading: false, 
    isError: false, 
    data: mockOperationsApiResponses.popularAirlines, 
    error: null 
  },
  isLoading: false,
  isError: true
});
