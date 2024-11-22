import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { subMonths, endOfMonth, startOfMonth, subDays } from 'date-fns';
import {
  GetSellerAnalyticsDto,
  GetAdminAnalyticsDto,
} from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Main analytics handler for both admin and seller
  async getAnalytics(params: GetSellerAnalyticsDto | GetAdminAnalyticsDto) {
    const { type, startMonthYear, endMonthYear, sellerId } =
      params as GetSellerAnalyticsDto;
    const { startDate, endDate } = this.getDateRange(
      startMonthYear,
      endMonthYear,
    );

    const analyticsMap = {
      totalRevenue: () =>
        sellerId
          ? this.calculateTotalRevenue(startDate, endDate, sellerId)
          : this.calculateTotalRevenue(startDate, endDate),
      monthlyRevenue: () =>
        sellerId
          ? this.calculateMonthlyRevenue(startDate, endDate, sellerId)
          : this.calculateMonthlyRevenue(startDate, endDate),
      totalUsers: () =>
        sellerId
          ? this.calculateTotalUsers(startDate, endDate, sellerId)
          : this.calculateTotalUsers(startDate, endDate),
      topSellingProducts: () =>
        sellerId
          ? this.calculateTopSellingProducts(startDate, endDate, sellerId)
          : this.calculateTopSellingProducts(startDate, endDate),
      topRevenueGeneratingProducts: () =>
        sellerId
          ? this.calculateTopRevenueGeneratingProducts(
              startDate,
              endDate,
              sellerId,
            )
          : this.calculateTopRevenueGeneratingProducts(startDate, endDate),
      totalProducts: () =>
        sellerId
          ? this.calculateTotalProducts(sellerId)
          : this.calculateTotalProducts(),
      weeklyOrders: () =>
        sellerId
          ? this.calculateWeeklyOrders(sellerId)
          : this.calculateWeeklyOrders(),
      fulfilledOrders: () =>
        sellerId
          ? this.calculateFulfilledOrders(startDate, endDate, sellerId)
          : this.calculateFulfilledOrders(startDate, endDate),
    };

    const analyticsFunction = analyticsMap[type];
    if (!analyticsFunction) {
      throw new Error('Invalid analytics type');
    }

    return await analyticsFunction();
  }

  // Calculate date range
  private getDateRange(startMonthYear?: string, endMonthYear?: string) {
    const startDate = startMonthYear
      ? new Date(`${startMonthYear}-01`)
      : subMonths(new Date(), 6);
    const endDate = endMonthYear
      ? endOfMonth(new Date(`${endMonthYear}-01`))
      : new Date();
    return { startDate, endDate };
  }

  private async calculateTopRevenueGeneratingProducts(
    startDate: Date,
    endDate: Date,
    sellerId?: number,
  ) {
    // Fetch orders within the specified date range
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { orderedItems: true },
    });

    // Map to store revenue for each product
    const productRevenueMap = new Map<string, number>();

    // Iterate over each order
    for (const order of orders) {
      const orderedItems = JSON.parse(order.orderedItems as string);

      // Filter items by sellerId if provided
      const filteredItems = sellerId
        ? orderedItems.filter((item: any) => item.sellerId === sellerId)
        : orderedItems;

      for (const item of filteredItems) {
        // Fetch the product price
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { price: true },
        });

        if (product) {
          const revenue = product.price * item.quantity;
          const currentRevenue = productRevenueMap.get(item.productId) || 0;

          // Update the revenue for this product
          productRevenueMap.set(item.productId, currentRevenue + revenue);
        }
      }
    }

    // Sort products by revenue in descending order and get the top 5
    const sortedProducts = Array.from(productRevenueMap.entries())
      .sort(([, revenueA], [, revenueB]) => revenueB - revenueA)
      .slice(0, 5);

    // Return the top revenue-generating products
    return {
      data: {
        topRevenueGeneratingProducts: sortedProducts.map(
          ([productId, revenue]) => ({
            productId,
            revenue,
          }),
        ),
      },
    };
  }

  // Calculate total revenue
  private async calculateTotalRevenue(
    startDate: Date,
    endDate: Date,
    sellerId?: number,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { orderedItems: true },
    });

    let totalRevenue = 0;
    for (const order of orders) {
      const orderedItems = JSON.parse(order.orderedItems as string);

      // Filter items by sellerId if provided
      const filteredItems = sellerId
        ? orderedItems.filter((item: any) => item.sellerId === sellerId)
        : orderedItems;

      for (const item of filteredItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { price: true },
        });
        if (product) {
          totalRevenue += product.price * item.quantity;
        }
      }
    }

    return { data: { totalRevenue } };
  }

  // Calculate monthly revenue
  private async calculateMonthlyRevenue(
    startDate: Date,
    endDate: Date,
    sellerId?: number,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { orderedItems: true, orderedAt: true },
    });

    const monthlyRevenueMap = new Map<string, number>();

    for (const order of orders) {
      const orderedItems = JSON.parse(order.orderedItems as string);
      const filteredItems = sellerId
        ? orderedItems.filter((item: any) => item.sellerId === sellerId)
        : orderedItems;

      const orderMonth = startOfMonth(order.orderedAt).toISOString();

      for (const item of filteredItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { price: true },
        });
        if (product) {
          const currentRevenue = monthlyRevenueMap.get(orderMonth) || 0;
          monthlyRevenueMap.set(
            orderMonth,
            currentRevenue + product.price * item.quantity,
          );
        }
      }
    }

    const result = Array.from(monthlyRevenueMap.entries()).map(
      ([month, revenue]) => ({
        month,
        revenue,
      }),
    );

    return { data: result };
  }

  // Calculate total users
  private async calculateTotalUsers(
    startDate: Date,
    endDate: Date,
    sellerId?: number,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { userId: true, orderedItems: true },
    });

    const uniqueUserIds = new Set<number>();

    for (const order of orders) {
      const orderedItems = JSON.parse(order.orderedItems as string);
      const filteredItems = sellerId
        ? orderedItems.filter((item: any) => item.sellerId === sellerId)
        : orderedItems;

      if (filteredItems.length > 0) {
        uniqueUserIds.add(order.userId);
      }
    }

    return { data: { totalUsers: uniqueUserIds.size } };
  }

  // Calculate top-selling products
  private async calculateTopSellingProducts(
    startDate: Date,
    endDate: Date,
    sellerId?: number,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { orderedItems: true },
    });

    const productSalesMap = new Map<string, number>();

    for (const order of orders) {
      const orderedItems = JSON.parse(order.orderedItems as string);
      const filteredItems = sellerId
        ? orderedItems.filter((item: any) => item.sellerId === sellerId)
        : orderedItems;

      for (const item of filteredItems) {
        productSalesMap.set(
          item.productId,
          (productSalesMap.get(item.productId) || 0) + item.quantity,
        );
      }
    }

    const sortedProducts = Array.from(productSalesMap.entries())
      .sort(([, salesA], [, salesB]) => salesB - salesA)
      .slice(0, 5);

    return { data: { topSellingProducts: sortedProducts } };
  }

  // Calculate total products
  private async calculateTotalProducts(sellerId?: number) {
    const totalProducts = await this.prisma.product.count({
      where: sellerId ? { sellerId } : undefined,
    });
    return { data: { totalProducts } };
  }

  // Calculate weekly orders
  private async calculateWeeklyOrders(sellerId?: number) {
    const now = new Date();
    const startOfWeek = subDays(now, 7);

    const orderCount = await this.prisma.order.count({
      where: {
        orderedAt: {
          gte: startOfWeek,
          lte: now,
        },
      },
    });

    return { data: { weeklyOrders: orderCount } };
  }

  // Calculate fulfilled orders
  private async calculateFulfilledOrders(
    startDate: Date,
    endDate: Date,
    sellerId?: number,
  ) {
    const fulfilledCount = await this.prisma.order.count({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
        orderFulfillmentStatus: 'Fulfilled',
      },
    });

    return { data: { fulfilledOrders: fulfilledCount } };
  }
}
