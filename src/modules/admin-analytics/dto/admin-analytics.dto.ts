// analytics.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AnalyticsType {
  MONTHLY_REVENUE = 'monthlyRevenue',
  AVERAGE_MONTHLY_REVENUE = 'averageMonthlyRevenue',
  TOTAL_REVENUE = 'totalRevenue',
  TOTAL_ORDERS_FULFILLED = 'totalOrdersFulfilled',
  TOTAL_ORDERS_CANCELLED = 'totalOrdersCancelled',
  TOP_REVENUE_GENERATING_PRODUCT = 'topRevenueGeneratingProduct',
  TOP_SELLING_PRODUCT = 'topSellingProduct',
  TOTAL_USERS = 'totalUsers',
  TOTAL_PRODUCTS = 'totalProducts',
  WEEKLY_ORDERS = 'weeklyOrders',
  FULFILLED_ORDERS = 'fulfilledOrders',
  RECENT_ORDERS = 'recentOrders',
  PERCENTAGE_ORDERS_LOST = 'percentageOrdersLost',
  PERCENTAGE_ORDERS_GAINED = 'percentageOrdersGained',
}

export class GetSellerAnalyticsDto {
  @ApiPropertyOptional({
    description: 'The type of analytics to retrieve',
    enum: AnalyticsType,
  })
  type: AnalyticsType;

  @ApiPropertyOptional({
    description: 'Optional start month and year (format: YYYY-MM)',
  })
  startMonthYear?: string;

  @ApiPropertyOptional({
    description: 'Optional end month and year (format: YYYY-MM)',
  })
  endMonthYear?: string;
}

export class SellerAnalyticsResponseDto {
  data: any; // This will depend on the type of analytics being returned
}
