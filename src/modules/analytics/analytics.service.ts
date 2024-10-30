import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  GetSellerAnalyticsDto,
  SellerAnalyticsResponseDto,
} from './dto/analytics.dto';
import { subMonths, endOfMonth, startOfMonth, subDays } from 'date-fns';

interface OrderedItem {
  productId: string;
  quantity: number;
}

// Type guard to check if an object is an OrderedItem
function isOrderedItem(item: any): item is OrderedItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.productId === 'string' &&
    typeof item.quantity === 'number'
  );
}

// Helper function to parse orderedItems safely
function parseOrderedItems(orderedItems: unknown): OrderedItem[] {
  if (typeof orderedItems === 'string') {
    try {
      const parsed = JSON.parse(orderedItems);
      if (Array.isArray(parsed) && parsed.every(isOrderedItem)) {
        return parsed;
      }
      console.error(
        'Parsed orderedItems is not a valid array of OrderedItems:',
        parsed,
      );
      return [];
    } catch (error) {
      console.error('Error parsing orderedItems:', error);
      return [];
    }
  } else if (Array.isArray(orderedItems) && orderedItems.every(isOrderedItem)) {
    return orderedItems;
  } else {
    console.error('Invalid type for orderedItems:', orderedItems);
    return [];
  }
}

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
        return this.getTotalUniqueUsers(sellerId, startDate, endDate);
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
        orderedAt: true,
      },
    });

    const monthlyRevenueMap = new Map<string, number>();

    for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      const orderMonth = startOfMonth(order.orderedAt).toISOString();

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            price: true,
            sellerId: true,
          },
        });

        if (product && product.sellerId === sellerId) {
          const revenue = product.price * item.quantity;
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

  private async getTotalUniqueUsers(
    sellerId: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderedAt: {
          gte: startDate || new Date('2000-01-01'),
          lte: endDate || new Date(),
        },
      },
      select: {
        userId: true,
        orderedItems: true,
      },
    });

    const uniqueUserIds = new Set<number>();

    for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          uniqueUserIds.add(order.userId);
          break;
        }
      }
    }

    return { data: { totalUsers: uniqueUserIds.size } };
  }

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

    for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          count++;
          break;
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

  private async getTotalProducts(sellerId: number) {
    const totalProducts = await this.prisma.product.count({
      where: { sellerId },
    });
    return { data: { totalProducts } };
  }

  private async getWeeklyOrders(sellerId: number) {
    const now = new Date();
    const startOfWeek = subDays(now, 7);

    const orders = await this.prisma.order.findMany({
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

    for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          orderCount++;
          break;
        }
      }
    }

    return { data: { weeklyOrders: orderCount } };
  }

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
      const orderedItems = parseOrderedItems(order.orderedItems);
      const orderMonth = startOfMonth(order.orderedAt).toISOString();

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          const currentCount = monthlyFulfilledMap.get(orderMonth) || 0;
          monthlyFulfilledMap.set(orderMonth, currentCount + 1);
          break;
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

  private async getRecentOrders(sellerId: number) {
    const orders = await this.prisma.order.findMany({
      where: {},
      orderBy: {
        orderedAt: 'desc',
      },
      take: 10,
    });

    const filteredOrders = orders.filter((order) => {
      const orderedItems = parseOrderedItems(order.orderedItems);
      return orderedItems.some(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { sellerId: true },
        });
        return product?.sellerId === sellerId;
      });
    });

    return { data: { recentOrders: filteredOrders } };
  }

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
      },
    });

    let totalRevenue = 0;

    for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            price: true,
            sellerId: true,
          },
        });

        if (product && product.sellerId === sellerId) {
          totalRevenue += product.price * item.quantity;
        }
      }
    }

    return { data: { totalRevenue } };
  }

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
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          fulfilledCount++;
          break;
        }
      }
    }

    return { data: { totalOrdersFulfilled: fulfilledCount } };
  }

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
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          cancelledCount++;
          break;
        }
      }
    }

    return { data: { totalOrdersCancelled: cancelledCount } };
  }

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
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            sellerId: true,
            price: true,
          },
        });

        if (product && product.sellerId === sellerId) {
          const revenue = product.price * item.quantity;
          productRevenueMap.set(
            item.productId,
            (productRevenueMap.get(item.productId) || 0) + revenue,
          );
        }
      }
    }

    const sortedProducts = Array.from(productRevenueMap.entries())
      .sort(([, revenueA], [, revenueB]) => revenueB - revenueA)
      .slice(0, 5);

    return { data: { topRevenueGeneratingProducts: sortedProducts } };
  }

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

    for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { sellerId: true },
        });

        if (product && product.sellerId === sellerId) {
          const currentSales = productSalesMap.get(item.productId) || 0;
          productSalesMap.set(item.productId, currentSales + item.quantity);
        }
      }
    }

    const sortedProducts = Array.from(productSalesMap.entries())
      .sort(([, salesA], [, salesB]) => salesB - salesA)
      .slice(0, 5);

    return { data: { topSellingProducts: sortedProducts } };
  }
}
