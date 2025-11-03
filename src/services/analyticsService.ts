import { analyticsApi, apiRequest } from './axiosConfig';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
  api_gateway: string;
  purpose: string;
  version: string;
}

export interface FunnelData {
  period_days: number;
  searches: number;
  reservations: number;
  payments: number;
  conversion: {
    search_to_reserve: number;
    reserve_to_pay: number;
    search_to_pay: number;
  };
}

export interface AverageFare {
  period_days: number;
  avg_fare: number;
}

export interface MonthlyRevenue {
  months: number;
  monthly: Array<{
    ym: string;
    revenue: number;
    payments: number;
  }>;
}

export interface LifetimeValue {
  top: number;
  ltv: Array<{
    userId: string;
    total_spend: number;
    payments: number;
  }>;
}

export interface RevenuePerUser {
  period_days: number;
  top: number;
  revenue_per_user: Array<{
    userId: string;
    revenue: number;
    payments: number;
  }>;
}

export interface PopularAirlines {
  period_days: number;
  top: number;
  popular_airlines: Array<{
    airlineCode: string;
    count: number;
    avg_price: number;
  }>;
}

export interface UserOrigins {
  period_days: number;
  top: number;
  user_origins: Array<{
    country: string;
    users: number;
  }>;
}

export interface BookingHours {
  period_days: number;
  histogram: Array<{
    hour_utc: number;
    count: number;
  }>;
}

export interface PaymentSuccess {
  period_days: number;
  approved: number;
  rejected: number;
  success_rate_percent: number;
}

export interface CancellationRate {
  period_days: number;
  created: number;
  canceled: number;
  cancellation_rate_percent: number;
}

export interface Anticipation {
  period_days: number;
  avg_anticipation_days: number;
}

export interface TimeToComplete {
  period_days: number;
  avg_minutes: {
    search_to_reserve: number;
    reserve_to_pay: number;
    search_to_pay: number;
  };
}

// New Analytics Types
export interface SummaryData {
  period_days: number;
  summary: {
    total_events: number;
    total_revenue: number;
    validation_rate: number;
    total_bookings: number;
  };
  events_by_type: Array<{
    type: string;
    count: number;
    avg_price: number | null;
  }>;
  validation_breakdown: Array<{
    status: string;
    count: number;
  }>;
  recent_activity: Array<{
    eventId: string;
    type: string;
    timestamp: string;
    received_at: string;
    validation_status: string;
  }>;
}

export interface RecentActivity {
  recent_events: Array<{
    eventId: string;
    type: string;
    timestamp: string;
    received_at: string;
    validation_status: string;
  }>;
  count: number;
  period_hours: number;
}

export interface SearchMetrics {
  period_days: number;
  top: number;
  routes: Array<{
    origin: string;
    destination: string;
    flightsFrom: string;
    flightsTo: string;
    searches: number;
    avg_results: number | null;
    max_results: number | null;
    min_results: number | null;
    avg_trip_length_days: number | null;
  }>;
  total_routes: number;
  total_searches: number;
}

export interface CatalogAirlineSummary {
  period_days: number;
  currency: string;
  airlines: Array<{
    airline_code: string;
    airline_name: string;
    total_flights: number;
    total_revenue: number;
    avg_price: number;
    market_share: number;
  }>;
}

export interface SearchCartSummary {
  period_days: number;
  top: number;
  total_additions: number;
  cart_items: Array<{
    flightId: string | number;
    additions: number;
    last_added_at: string;
  }>;
}

export interface FlightsAircraft {
  period_days: number;
  aircraft: Array<{
    aircraftId: string;
    airlineBrand: string;
    capacity: number;
    updates: number;
  }>;
}

// =============================================================================
// ANALYTICS API FUNCTIONS
// =============================================================================

// Health Check
export const getHealthStatus = (): Promise<HealthStatus> =>
  apiRequest<HealthStatus>(analyticsApi, {
    method: 'GET',
    url: '/health',
  });

// Funnel Analytics
export const getFunnelData = (days: number = 7): Promise<FunnelData> =>
  apiRequest<FunnelData>(analyticsApi, {
    method: 'GET',
    url: '/analytics/funnel',
    params: { days },
  });

// Average Fare
export const getAverageFare = (days: number = 7): Promise<AverageFare> =>
  apiRequest<AverageFare>(analyticsApi, {
    method: 'GET',
    url: '/analytics/avg-fare',
    params: { days },
  });

// Monthly Revenue
export const getMonthlyRevenue = (months: number = 6): Promise<MonthlyRevenue> =>
  apiRequest<MonthlyRevenue>(analyticsApi, {
    method: 'GET',
    url: '/analytics/revenue-monthly',
    params: { months },
  });

// Lifetime Value
export const getLifetimeValue = (top: number = 10): Promise<LifetimeValue> =>
  apiRequest<LifetimeValue>(analyticsApi, {
    method: 'GET',
    url: '/analytics/ltv',
    params: { top },
  });

// Revenue per User
export const getRevenuePerUser = (days: number = 7, top: number = 10): Promise<RevenuePerUser> =>
  apiRequest<RevenuePerUser>(analyticsApi, {
    method: 'GET',
    url: '/analytics/revenue-per-user',
    params: { days, top },
  });

// Popular Airlines
export const getPopularAirlines = (days: number = 7, top: number = 5): Promise<PopularAirlines> =>
  apiRequest<PopularAirlines>(analyticsApi, {
    method: 'GET',
    url: '/analytics/popular-airlines',
    params: { days, top },
  });

// User Origins
export const getUserOrigins = (days: number = 7, top: number = 10): Promise<UserOrigins> =>
  apiRequest<UserOrigins>(analyticsApi, {
    method: 'GET',
    url: '/analytics/user-origins',
    params: { days, top },
  });

// Booking Hours
export const getBookingHours = (days: number = 7): Promise<BookingHours> =>
  apiRequest<BookingHours>(analyticsApi, {
    method: 'GET',
    url: '/analytics/booking-hours',
    params: { days },
  });

// Payment Success Rate
export const getPaymentSuccessRate = (days: number = 7): Promise<PaymentSuccess> =>
  apiRequest<PaymentSuccess>(analyticsApi, {
    method: 'GET',
    url: '/analytics/payment-success',
    params: { days },
  });

// Cancellation Rate
export const getCancellationRate = (days: number = 7): Promise<CancellationRate> =>
  apiRequest<CancellationRate>(analyticsApi, {
    method: 'GET',
    url: '/analytics/cancellation-rate',
    params: { days },
  });

// Anticipation
export const getAnticipation = (days: number = 90): Promise<Anticipation> =>
  apiRequest<Anticipation>(analyticsApi, {
    method: 'GET',
    url: '/analytics/anticipation',
    params: { days },
  });

// Time to Complete
export const getTimeToComplete = (days: number = 7): Promise<TimeToComplete> =>
  apiRequest<TimeToComplete>(analyticsApi, {
    method: 'GET',
    url: '/analytics/time-to-complete',
    params: { days },
  });

// =============================================================================
// NEW ANALYTICS API FUNCTIONS
// =============================================================================

// Summary
export const getSummary = (): Promise<SummaryData> =>
  apiRequest<SummaryData>(analyticsApi, {
    method: 'GET',
    url: '/analytics/summary',
  });

// Recent Activity
export const getRecentActivity = (limit: number = 10, hours: number = 24): Promise<RecentActivity> =>
  apiRequest<RecentActivity>(analyticsApi, {
    method: 'GET',
    url: '/analytics/recent',
    params: { limit, hours },
  });

// Search Metrics
export const getSearchMetrics = (days: number = 14, top: number = 10): Promise<SearchMetrics> =>
  apiRequest<SearchMetrics>(analyticsApi, {
    method: 'GET',
    url: '/analytics/search-metrics',
    params: { days, top },
  });

// Catalog Airline Summary
export const getCatalogAirlineSummary = (days: number = 30, currency: string = 'USD'): Promise<CatalogAirlineSummary> =>
  apiRequest<CatalogAirlineSummary>(analyticsApi, {
    method: 'GET',
    url: '/analytics/catalog/airline-summary',
    params: { days, currency },
  });

// Search Cart Summary
export const getSearchCartSummary = (days: number = 7, top: number = 10): Promise<SearchCartSummary> =>
  apiRequest<SearchCartSummary>(analyticsApi, {
    method: 'GET',
    url: '/analytics/search/cart',
    params: { days, top },
  });

// Flights Aircraft
export const getFlightsAircraft = (days: number = 30): Promise<FlightsAircraft> =>
  apiRequest<FlightsAircraft>(analyticsApi, {
    method: 'GET',
    url: '/analytics/flights/aircraft',
    params: { days },
  });
