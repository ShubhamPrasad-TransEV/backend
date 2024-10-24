// analytics.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetSellerAnalyticsDto, SellerAnalyticsResponseDto } from './dto/analytics.dto';
import { subMonths, endOfMonth, startOfMonth, subDays } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSellerAnalytics(params: GetSellerAnalyticsDto): Promise<SellerAnalyticsResponseDto> {
    const { sellerId, type, startMonthYear, endMonthYear } = params;

    const startDate = startMonthYear
      ? new Date(`${startMonthYear}-01`)
      : subMonths(new Date(), 6);
    const endDate = endMonthYear
      ? endOfMonth(new Date(`${endMonthYear}-01`))
      : new Date();

    switch (type) {
      case 'monthlyRevenue':
        return this.getMonthlyRevenue(sellerId, startDate, endDate);
      case 'totalUsers':
        return this.getTotalUniqueUsers(sellerId);
      case 'percentageOrdersLost':
        return this.getPercentageOrdersLost(sellerId, startDate, endDate);
      case 'percentageOrdersGained':
        return this.getPercentageOrdersGained(sellerId, startDate, endDate);
      case 'totalProducts':
        return this.getTotalProducts(sellerId);
      case 'weeklyOrders':
        return this.getWeeklyOrders(sellerId);
      case 'fulfilledOrders':
        return this.getFulfilledOrders(sellerId, startDate, endDate);
      case 'recentOrders':
        return this.getRecentOrders(sellerId);
      default:
        throw new Error('Invalid analytics type');
    }
  }

  // Monthly revenue
  private async getMonthlyRevenue(sellerId: number, startDate: Date, endDate: Date) {
    const orders = await this.prisma.order.groupBy({
      by: ['orderedAt'],
      where: {
        sellerId,
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        shippingCost: true,
      },
    });

    const result = orders.map(order => ({
      month: startOfMonth(order.orderedAt),
      revenue: order._sum.shippingCost,
    }));

    return { data: result };
  }

  // Total unique users
  private async getTotalUniqueUsers(sellerId: number) {
    // Fetch all users who ordered from the seller, deduplicate on `userId`
    const orders = await this.prisma.order.findMany({
      where: {
        sellerId,
      },
      select: {
        userId: true, // Only fetch `userId` from each order
      },
    });
  
    // Deduplicate userId values using a Set
    const uniqueUserIds = Array.from(new Set(orders.map(order => order.userId)));
  
    return { data: { totalUsers: uniqueUserIds.length } };
  }

  // Percentage of orders lost
  private async getPercentageOrdersLost(sellerId: number, startDate: Date, endDate: Date) {
    const previousStartDate = subMonths(startDate, 1);
    const previousEndDate = subMonths(endDate, 1);

    const currentOrdersCount = await this.prisma.order.count({
      where: {
        sellerId,
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
        orderingStatus: 'Cancelled',
      },
    });

    const previousOrdersCount = await this.prisma.order.count({
      where: {
        sellerId,
        orderedAt: {
          gte: previousStartDate,
          lte: previousEndDate,
        },
        orderingStatus: 'Cancelled',
      },
    });

    const percentageLost = this.calculatePercentageChange(previousOrdersCount, currentOrdersCount);

    return { data: { percentageOrdersLost: percentageLost } };
  }

  // Percentage of orders gained
  private async getPercentageOrdersGained(sellerId: number, startDate: Date, endDate: Date) {
    const previousStartDate = subMonths(startDate, 1);
    const previousEndDate = subMonths(endDate, 1);

    const currentOrdersCount = await this.prisma.order.count({
      where: {
        sellerId,
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
        orderingStatus: 'Completed',
      },
    });

    const previousOrdersCount = await this.prisma.order.count({
      where: {
        sellerId,
        orderedAt: {
          gte: previousStartDate,
          lte: previousEndDate,
        },
        orderingStatus: 'Completed',
      },
    });

    const percentageGained = this.calculatePercentageChange(previousOrdersCount, currentOrdersCount);

    return { data: { percentageOrdersGained: percentageGained } };
  }

  private calculatePercentageChange(previousCount: number, currentCount: number): number {
    if (previousCount === 0) {
      return currentCount > 0 ? 100 : 0;
    }
    return ((currentCount - previousCount) / previousCount) * 100;
  }

  // Total products for seller
  private async getTotalProducts(sellerId: number) {
    const totalProducts = await this.prisma.product.count({
      where: { sellerId },
    });
    return { data: { totalProducts } };
  }

  // Weekly orders
  private async getWeeklyOrders(sellerId: number) {
    const now = new Date();
    const startOfWeek = subDays(now, 7);

    const weeklyOrders = await this.prisma.order.count({
      where: {
        sellerId,
        orderedAt: {
          gte: startOfWeek,
          lte: now,
        },
      },
    });

    return { data: { weeklyOrders } };
  }

  // Fulfilled orders (grouped by month, last 6 months if no date provided)
  private async getFulfilledOrders(sellerId: number, startDate: Date, endDate: Date) {
    const ordersByMonth = await this.prisma.order.groupBy({
      by: ['orderedAt'],
      where: {
        sellerId,
        orderFulfillmentStatus: 'Fulfilled',
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        _all: true,
      },
    });

    const result = ordersByMonth.map(order => ({
      month: startOfMonth(order.orderedAt),
      fulfilledOrders: order._count._all,
    }));

    return { data: result };
  }

  // Recent orders (last 10 orders)
  private async getRecentOrders(sellerId: number) {
    const recentOrders = await this.prisma.order.findMany({
      where: {
        sellerId,
      },
      orderBy: {
        orderedAt: 'desc',
      },
      take: 10,
    });

    return { data: { recentOrders } };
  }
}
