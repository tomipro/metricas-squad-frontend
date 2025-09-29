// Mock data for Operations tab tests
// @ts-nocheck
import { 
  FunnelData, 
  PaymentSuccessData, 
  TimeToCompleteData, 
  CancellationRateData, 
  PopularAirlinesData 
} from '../../types/dashboard';

// Mock API responses for Operations tab
export const mockOperationsApiResponses = {
  funnelData: {
    period_days: 30,
    searches: 15000,
    reservations: 4500,
    payments: 3200,
    conversion: {
      search_to_reserve: 30.0,
      reserve_to_pay: 71.1,
      search_to_pay: 21.3
    }
  } as FunnelData,

  paymentSuccess: {
    period_days: 30,
    success_rate_percent: 91.4,
    total_attempts: 3500,
    successful_payments: 3200,
    failed_payments: 300
  } as PaymentSuccessData,

  timeToComplete: {
    period_days: 30,
    avg_minutes: {
      search_to_reserve: 8.5,
      reserve_to_pay: 3.2,
      search_to_pay: 11.7
    }
  } as TimeToCompleteData,

  cancellationRate: {
    period_days: 30,
    cancellation_rate_percent: 12.5,
    total_reservations: 4500,
    cancelled_reservations: 563,
    active_reservations: 3937
  } as CancellationRateData,

  popularAirlines: [
    { airline: "American Airlines", bookings: 1200, percentage: 26.7 },
    { airline: "Delta Air Lines", bookings: 980, percentage: 21.8 },
    { airline: "United Airlines", bookings: 850, percentage: 18.9 },
    { airline: "Southwest Airlines", bookings: 720, percentage: 16.0 },
    { airline: "JetBlue Airways", bookings: 750, percentage: 16.7 }
  ] as PopularAirlinesData
};

// Empty data responses
export const mockOperationsEmptyData = {
  funnelData: {
    period_days: 30,
    searches: 0,
    reservations: 0,
    payments: 0,
    conversion: {
      search_to_reserve: 0,
      reserve_to_pay: 0,
      search_to_pay: 0
    }
  } as FunnelData,

  paymentSuccess: {
    period_days: 30,
    success_rate_percent: 0,
    total_attempts: 0,
    successful_payments: 0,
    failed_payments: 0
  } as PaymentSuccessData,

  timeToComplete: {
    period_days: 30,
    avg_minutes: {
      search_to_reserve: 0,
      reserve_to_pay: 0,
      search_to_pay: 0
    }
  } as TimeToCompleteData,

  cancellationRate: {
    period_days: 30,
    cancellation_rate_percent: 0,
    total_reservations: 0,
    cancelled_reservations: 0,
    active_reservations: 0
  } as CancellationRateData,

  popularAirlines: [] as PopularAirlinesData
};

// Error responses
export const mockOperationsErrorResponses = {
  funnelData: new Error('Failed to fetch funnel data'),
  paymentSuccess: new Error('Failed to fetch payment success data'),
  timeToComplete: new Error('Failed to fetch time to complete data'),
  cancellationRate: new Error('Failed to fetch cancellation rate data'),
  popularAirlines: new Error('Failed to fetch popular airlines data')
};
