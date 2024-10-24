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
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        orderedItems: true,
        orderedAt: true, // For grouping by month
      },
    });

    const monthlyRevenueMap = new Map<string, number>();

    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };
      const orderMonth = startOfMonth(order.orderedAt).toISOString();

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: {
            sellerId: true,
            price: true,
          },
        });

        if (product && product.sellerId === sellerId) {
          const quantity = orderedItems[productId];
          const revenue = product.price * quantity;

          const currentRevenue = monthlyRevenueMap.get(orderMonth) || 0;
          monthlyRevenueMap.set(orderMonth, currentRevenue + revenue);
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

  // Total unique users
  private async getTotalUniqueUsers(sellerId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: new Date('2000-01-01'), // Fetch all orders (no date restriction for this query)
        },
      },
      select: {
        userId: true,
        orderedItems: true, // We need orderedItems to filter by seller
      },
    });

    const uniqueUserIds = new Set<number>();

    // Iterate over all orders and filter based on sellerId in orderedItems
    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          uniqueUserIds.add(order.userId);
        }
      }
    }

    return { data: { totalUsers: uniqueUserIds.size } };
  }

  // Percentage of orders lost
  private async getPercentageOrdersLost(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const previousStartDate = subMonths(startDate, 1);
    const previousEndDate = subMonths(endDate, 1);

    const currentOrdersCount = await this.countOrdersByStatus(
      sellerId,
      startDate,
      endDate,
      'Cancelled',
    );

    const previousOrdersCount = await this.countOrdersByStatus(
      sellerId,
      previousStartDate,
      previousEndDate,
      'Cancelled',
    );

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

    const currentOrdersCount = await this.countOrdersByStatus(
      sellerId,
      startDate,
      endDate,
      'Completed',
    );

    const previousOrdersCount = await this.countOrdersByStatus(
      sellerId,
      previousStartDate,
      previousEndDate,
      'Completed',
    );

    const percentageGained = this.calculatePercentageChange(
      previousOrdersCount,
      currentOrdersCount,
    );

    return { data: { percentageOrdersGained: percentageGained } };
  }

  // Helper to count orders by status (Cancelled or Completed)
  private async countOrdersByStatus(
    sellerId: number,
    startDate: Date,
    endDate: Date,
    status: string,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
        orderingStatus: status,
      },
      select: {
        orderedItems: true,
      },
    });

    let count = 0;

    // Check each product's sellerId in the ordered items
    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          count++;
          break; // Stop checking the rest of the items if one matches the seller
        }
      }
    }

    return count;
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

    const weeklyOrders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startOfWeek,
          lte: now,
        },
      },
      select: {
        orderedItems: true,
      },
    });

    let orderCount = 0;

    // Check each product's sellerId in the ordered items
    for (const order of weeklyOrders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          orderCount++;
          break; // Stop checking if one product matches the seller
        }
      }
    }

    return { data: { weeklyOrders: orderCount } };
  }

  // Fulfilled orders (grouped by month, last 6 months if no date provided)
  private async getFulfilledOrders(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
        orderFulfillmentStatus: 'Fulfilled',
      },
      select: {
        orderedItems: true,
        orderedAt: true,
      },
    });

    const monthlyFulfilledMap = new Map<string, number>();

    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };
      const orderMonth = startOfMonth(order.orderedAt).toISOString();

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          const currentCount = monthlyFulfilledMap.get(orderMonth) || 0;
          monthlyFulfilledMap.set(orderMonth, currentCount + 1);
          break; // Stop checking once a match is found for the seller
        }
      }
    }

    const result = Array.from(monthlyFulfilledMap.entries()).map(
      ([month, count]) => ({
        month,
        fulfilledOrders: count,
      }),
    );

    return { data: result };
  }

  // Recent orders (last 10 orders)
  private async getRecentOrders(sellerId: number) {
    const recentOrders = await this.prisma.order.findMany({
      where: {},
      orderBy: {
        orderedAt: 'desc',
      },
      take: 10,
      select: {
        orderedItems: true,
        orderedAt: true,
      },
    });

    const filteredOrders = [];

    for (const order of recentOrders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          filteredOrders.push(order);
          break; // Add the order to the list if one item matches the seller
        }
      }
    }

    return { data: { recentOrders: filteredOrders } };
  }

  // Total revenue for a specific time period
  private async getTotalRevenue(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        orderedItems: true,
        totalItemCost: true,
      },
    });

    let totalRevenue = 0;

    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: {
            sellerId: true,
            price: true,
          },
        });

        if (product && product.sellerId === sellerId) {
          const quantity = orderedItems[productId];
          totalRevenue += product.price * quantity;
        }
      }
    }

    return { data: { totalRevenue } };
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
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
        orderFulfillmentStatus: 'Fulfilled',
      },
      select: {
        orderedItems: true,
      },
    });

    let fulfilledCount = 0;

    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          fulfilledCount++;
          break; // Stop checking once a match is found for the seller
        }
      }
    }

    return { data: { totalOrdersFulfilled: fulfilledCount } };
  }

  // Total orders cancelled
  private async getTotalOrdersCancelled(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
        orderingStatus: 'Cancelled',
      },
      select: {
        orderedItems: true,
      },
    });

    let cancelledCount = 0;

    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          cancelledCount++;
          break; // Stop checking once a match is found for the seller
        }
      }
    }

    return { data: { totalOrdersCancelled: cancelledCount } };
  }

  // Top 5 revenue-generating products (considering totalItemCost)
  private async getTopRevenueGeneratingProduct(
    sellerId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        orderedItems: true,
      },
    });

    const productRevenueMap = new Map<string, number>();

    for (const order of orders) {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: {
            sellerId: true,
            price: true,
            id: true,
          },
        });

        if (product && product.sellerId === sellerId) {
          const quantity = orderedItems[productId];
          const productRevenue = product.price * quantity;
          const currentRevenue = productRevenueMap.get(product.id) || 0;
          productRevenueMap.set(product.id, currentRevenue + productRevenue);
        }
      }
    }

    const sortedProducts = Array.from(productRevenueMap.entries())
      .sort(([, revenueA], [, revenueB]) => revenueB - revenueA)
      .slice(0, 5);

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
        orderedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        orderedItems: true,
      },
    });

    const productSalesMap = new Map<string, number>();

    orders.forEach(async (order) => {
      const orderedItems = order.orderedItems as {
        [productId: string]: number;
      };

      for (const productId in orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          const currentSales = productSalesMap.get(productId) || 0;
          productSalesMap.set(
            productId,
            currentSales + orderedItems[productId],
          );
        }
      }
    });

    const sortedProducts = Array.from(productSalesMap.entries())
      .sort(([, salesA], [, salesB]) => salesB - salesA)
      .slice(0, 5);

    return { data: { topSellingProducts: sortedProducts } };
  }
}
