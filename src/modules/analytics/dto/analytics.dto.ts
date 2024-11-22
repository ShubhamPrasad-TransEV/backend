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
    description: 'The ID of the seller to retrieve analytics for',
    example: 123,
  })
  sellerId: number;

  @ApiPropertyOptional({
    description: 'The type of analytics to retrieve',
    enum: AnalyticsType,
  })
  type: AnalyticsType;

  @ApiPropertyOptional({
    description: 'Optional start month and year (format: YYYY-MM)',
    example: '2024-01',
  })
  startMonthYear?: string;

  @ApiPropertyOptional({
    description: 'Optional end month and year (format: YYYY-MM)',
    example: '2024-12',
  })
  endMonthYear?: string;
}

export class GetAdminAnalyticsDto {
  @ApiPropertyOptional({
    description: 'The type of analytics to retrieve',
    enum: AnalyticsType,
  })
  type: AnalyticsType;

  @ApiPropertyOptional({
    description: 'Optional start month and year (format: YYYY-MM)',
    example: '2024-01',
  })
  startMonthYear?: string;

  @ApiPropertyOptional({
    description: 'Optional end month and year (format: YYYY-MM)',
    example: '2024-12',
  })
  endMonthYear?: string;
}

export class SellerAnalyticsResponseDto {
  @ApiPropertyOptional({
    description: 'The data for the requested seller analytics',
  })
  data: any;
}

export class AdminAnalyticsResponseDto {
  @ApiPropertyOptional({
    description: 'The data for the requested admin analytics',
  })
  data: any;
}
