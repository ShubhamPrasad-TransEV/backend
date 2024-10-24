// analytics.dto.ts

export class GetSellerAnalyticsDto {
  sellerId: number;
  type:
    | 'monthlyRevenue'
    | 'averageMonthlyRevenue'
    | 'totalRevenue'
    | 'totalOrdersFulfilled'
    | 'totalOrdersCancelled'
    | 'topRevenueGeneratingProduct'
    | 'topSellingProduct'
    | 'totalUsers'
    | 'totalProducts'
    | 'weeklyOrders'
    | 'fulfilledOrders'
    | 'recentOrders'
    | 'percentageOrdersLost'
    | 'percentageOrdersGained';
  startMonthYear?: string; // Format: 'YYYY-MM'
  endMonthYear?: string; // Format: 'YYYY-MM'
}

export class SellerAnalyticsResponseDto {
  data: any; // The structure will vary based on the type (e.g., total revenue, recent orders, etc.)
}
