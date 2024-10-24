// analytics.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  GetSellerAnalyticsDto,
  SellerAnalyticsResponseDto,
} from './dto/analytics.dto';
import { subMonths, endOfMonth, startOfMonth, subDays } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSellerAnalytics(
    params: GetSellerAnalyticsDto,
  ): Promise<SellerAnalyticsResponseDto> {
    const { type, startMonthYear, endMonthYear } = params;
    const sellerId = Number(params.sellerId);

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
      case 'totalRevenue':
        return this.getTotalRevenue(sellerId, startDate, endDate);
      case 'averageMonthlyRevenue':
        return this.getAverageMonthlyRevenue(sellerId, startDate, endDate);
      case 'totalOrdersFulfilled':
        return this.getTotalOrdersFulfilled(sellerId, startDate, endDate);
      case 'totalOrdersCancelled':
        return this.getTotalOrdersCancelled(sellerId, startDate, endDate);
      case 'topRevenueGeneratingProduct':
        return this.getTopRevenueGeneratingProduct(
          sellerId,
          startDate,
          endDate,
        );
      case 'topSellingProduct':
        return this.getTopSellingProduct(sellerId, startDate, endDate);
      default:
        throw new Error('Invalid analytics type');
    }
  }

  // Monthly revenue
  private async getMonthlyRevenue(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
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
        totalItemCost: true, // Sum totalItemCost instead of shippingCost
      },
    });

    const result = orders.map((order) => ({
      month: startOfMonth(order.orderedAt),
      revenue: order._sum.totalItemCost, // Use totalItemCost for monthly revenue
    }));

    return { data: result };
  }

  // Total unique users
  private async getTotalUniqueUsers(sellerId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        sellerId,
      },
      select: {
        userId: true,
      },
    });

    const uniqueUserIds = Array.from(
      new Set(orders.map((order) => order.userId)),
    );

    return { data: { totalUsers: uniqueUserIds.length } };
  }

  // Percentage of orders lost
  private async getPercentageOrdersLost(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
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

    const percentageLost = this.calculatePercentageChange(
      previousOrdersCount,
      currentOrdersCount,
    );

    return { data: { percentageOrdersLost: percentageLost } };
  }

  // Percentage of orders gained
  private async getPercentageOrdersGained(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
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

    const percentageGained = this.calculatePercentageChange(
      previousOrdersCount,
      currentOrdersCount,
    );

    return { data: { percentageOrdersGained: percentageGained } };
  }

  private calculatePercentageChange(
    previousCount: number,
    currentCount: number,
  ): number {
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
  private async getFulfilledOrders(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
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

    const result = ordersByMonth.map((order) => ({
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

  // Total revenue for a specific time period
  private async getTotalRevenue(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        totalItemCost: true, // Sum totalItemCost instead of shippingCost
      },
      where: {
        sellerId,
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return { data: { totalRevenue: totalRevenue._sum.totalItemCost } };
  }

  // Average monthly revenue
  private async getAverageMonthlyRevenue(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const totalRevenueData = await this.getTotalRevenue(
      sellerId,
      startDate,
      endDate,
    );
    const months = Math.max(
      1,
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth()),
    );
    const averageRevenue = totalRevenueData.data.totalRevenue / months;

    return { data: { averageMonthlyRevenue: averageRevenue } };
  }

  // Total orders fulfilled
  private async getTotalOrdersFulfilled(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const totalOrdersFulfilled = await this.prisma.order.count({
      where: {
        sellerId,
        orderFulfillmentStatus: 'Fulfilled',
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return { data: { totalOrdersFulfilled } };
  }

  // Total orders cancelled
  private async getTotalOrdersCancelled(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const totalOrdersCancelled = await this.prisma.order.count({
      where: {
        sellerId,
        orderingStatus: 'Cancelled',
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return { data: { totalOrdersCancelled } };
  }

  // Top 5 revenue-generating products (considering totalItemCost)
  private async getTopRevenueGeneratingProduct(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        sellerId,
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        orderedItems: true,
        totalItemCost: true, // Fetch totalItemCost
      },
    });

    const productRevenueMap = new Map<string, number>(); // productId (as string) -> total revenue

    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      }; // Product IDs are strings

      const productIds = Object.keys(orderedItems);
      const products = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
        select: {
          id: true,
          price: true,
        },
      });

      for (const product of products) {
        const quantity = orderedItems[product.id];
        const productRevenue = product.price * quantity; // Calculate revenue without shipping cost

        const currentRevenue = productRevenueMap.get(product.id) || 0;
        productRevenueMap.set(product.id, currentRevenue + productRevenue);
      }
    }

    // Convert map to array and sort by revenue
    const sortedProducts = Array.from(productRevenueMap.entries())
      .sort(([, revenueA], [, revenueB]) => revenueB - revenueA)
      .slice(0, 5); // Get top 5

    return { data: { topRevenueGeneratingProducts: sortedProducts } };
  }

  // Top 5 selling products
  private async getTopSellingProduct(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        sellerId,
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        orderedItems: true,
      },
    });

    const productSalesMap = new Map<string, number>(); // productId (as string) -> total quantity sold

    orders.forEach((order) => {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      }; // Product IDs are strings

      for (const productId in orderedItems) {
        const currentSales = productSalesMap.get(productId) || 0;
        productSalesMap.set(productId, currentSales + orderedItems[productId]);
      }
    });

    // Convert map to array and sort by quantity sold
    const sortedProducts = Array.from(productSalesMap.entries())
      .sort(([, salesA], [, salesB]) => salesB - salesA)
      .slice(0, 5); // Get top 5

    return { data: { topSellingProducts: sortedProducts } };
  }
}
