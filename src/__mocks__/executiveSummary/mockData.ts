// Mock data for Executive Summary tests
// @ts-nocheck

// Mock API responses for Executive Summary - matching the actual API structure
export const mockApiResponses = {
  funnel: {
    period_days: 30,
    searches: 15000,
    reservations: 4500,
    payments: 3200,
    conversion: {
      search_to_reserve: 30.0,
      reserve_to_pay: 71.1,
      search_to_pay: 21.3
    }
  },

  averageFare: {
    period_days: 30,
    avg_fare: 451
  },

  monthlyRevenue: {
    months: 6,
    monthly: [
      { ym: '2024-01', revenue: 1200000, payments: 850 },
      { ym: '2024-02', revenue: 1350000, payments: 920 },
      { ym: '2024-03', revenue: 1420000, payments: 980 },
      { ym: '2024-04', revenue: 1380000, payments: 950 },
      { ym: '2024-05', revenue: 1450000, payments: 1000 },
      { ym: '2024-06', revenue: 1500000, payments: 1050 }
    ]
  },

  lifetimeValue: {
    top: 10,
    ltv: [
      { userId: 'user1', total_spend: 2501, payments: 5 },
      { userId: 'user2', total_spend: 2200, payments: 4 },
      { userId: 'user3', total_spend: 1800, payments: 3 }
    ]
  },

  revenuePerUser: {
    period_days: 30,
    top: 10,
    revenue_per_user: [
      { userId: 'user1', revenue: 850, payments: 2 },
      { userId: 'user2', revenue: 720, payments: 2 },
      { userId: 'user3', revenue: 650, payments: 1 }
    ]
  },

  paymentSuccess: {
    period_days: 30,
    approved: 3200,
    rejected: 300,
    success_rate_percent: 91.4
  },

  anticipation: {
    period_days: 90,
    avg_anticipation_days: 15
  }
};

export const mockEmptyApiResponses = {
  funnel: {
    period_days: 30,
    searches: 0,
    reservations: 0,
    payments: 0,
    conversion: {
      search_to_reserve: 0,
      reserve_to_pay: 0,
      search_to_pay: 0
    }
  },

  averageFare: {
    period_days: 30,
    avg_fare: 0
  },

  monthlyRevenue: {
    months: 6,
    monthly: []
  },

  lifetimeValue: {
    top: 10,
    ltv: []
  },

  revenuePerUser: {
    period_days: 30,
    top: 10,
    revenue_per_user: []
  },

  paymentSuccess: {
    period_days: 30,
    approved: 0,
    rejected: 0,
    success_rate_percent: 0
  },

  anticipation: {
    period_days: 90,
    avg_anticipation_days: 0
  }
};
