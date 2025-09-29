// Mock implementations for Executive Summary hooks
// @ts-nocheck
import { mockApiResponses, mockEmptyApiResponses } from './mockData';

// Mock useExecutiveSummary hook implementations
export const mockUseExecutiveSummaryLoading = () => ({
  funnelData: { isLoading: true, isError: false, data: null, error: null },
  averageFare: { isLoading: true, isError: false, data: null, error: null },
  monthlyRevenue: { isLoading: true, isError: false, data: null, error: null },
  lifetimeValue: { isLoading: true, isError: false, data: null, error: null },
  revenuePerUser: { isLoading: true, isError: false, data: null, error: null },
  paymentSuccess: { isLoading: true, isError: false, data: null, error: null },
  anticipation: { isLoading: true, isError: false, data: null, error: null },
  isLoading: true,
  isError: false
});

export const mockUseExecutiveSummarySuccess = () => ({
  funnelData: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.funnel, 
    error: null 
  },
  averageFare: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.averageFare, 
    error: null 
  },
  monthlyRevenue: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.monthlyRevenue, 
    error: null 
  },
  lifetimeValue: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.lifetimeValue, 
    error: null 
  },
  revenuePerUser: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.revenuePerUser, 
    error: null 
  },
  paymentSuccess: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.paymentSuccess, 
    error: null 
  },
  anticipation: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.anticipation, 
    error: null 
  },
  isLoading: false,
  isError: false
});

export const mockUseExecutiveSummaryError = () => ({
  funnelData: { isLoading: false, isError: true, data: null, error: new Error('API Error') },
  averageFare: { isLoading: false, isError: true, data: null, error: new Error('API Error') },
  monthlyRevenue: { isLoading: false, isError: true, data: null, error: new Error('API Error') },
  lifetimeValue: { isLoading: false, isError: true, data: null, error: new Error('API Error') },
  revenuePerUser: { isLoading: false, isError: true, data: null, error: new Error('API Error') },
  paymentSuccess: { isLoading: false, isError: true, data: null, error: new Error('API Error') },
  anticipation: { isLoading: false, isError: true, data: null, error: new Error('API Error') },
  isLoading: false,
  isError: true
});

export const mockUseExecutiveSummaryEmpty = () => ({
  funnelData: { 
    isLoading: false, 
    isError: false, 
    data: mockEmptyApiResponses.funnel, 
    error: null 
  },
  averageFare: { 
    isLoading: false, 
    isError: false, 
    data: mockEmptyApiResponses.averageFare, 
    error: null 
  },
  monthlyRevenue: { 
    isLoading: false, 
    isError: false, 
    data: mockEmptyApiResponses.monthlyRevenue, 
    error: null 
  },
  lifetimeValue: { 
    isLoading: false, 
    isError: false, 
    data: mockEmptyApiResponses.lifetimeValue, 
    error: null 
  },
  revenuePerUser: { 
    isLoading: false, 
    isError: false, 
    data: mockEmptyApiResponses.revenuePerUser, 
    error: null 
  },
  paymentSuccess: { 
    isLoading: false, 
    isError: false, 
    data: mockEmptyApiResponses.paymentSuccess, 
    error: null 
  },
  anticipation: { 
    isLoading: false, 
    isError: false, 
    data: mockEmptyApiResponses.anticipation, 
    error: null 
  },
  isLoading: false,
  isError: false
});

export const mockUseExecutiveSummaryPartialError = () => ({
  funnelData: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.funnel, 
    error: null 
  },
  averageFare: { 
    isLoading: false, 
    isError: true, 
    data: null, 
    error: new Error('API Error') 
  },
  monthlyRevenue: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.monthlyRevenue, 
    error: null 
  },
  lifetimeValue: { 
    isLoading: false, 
    isError: true, 
    data: null, 
    error: new Error('API Error') 
  },
  revenuePerUser: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.revenuePerUser, 
    error: null 
  },
  paymentSuccess: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.paymentSuccess, 
    error: null 
  },
  anticipation: { 
    isLoading: false, 
    isError: false, 
    data: mockApiResponses.anticipation, 
    error: null 
  },
  isLoading: false,
  isError: true // Overall error if any sub-hook has an error
});
