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

//main analytics class
@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  //get seller analytics
  async getSellerAnalytics(
    params: GetSellerAnalyticsDto,
  ): Promise<SellerAnalyticsResponseDto> {
    const { type, startMonthYear, endMonthYear, sellerId } = params;
    const sellerIdInt = Number(sellerId);

    const { startDate, endDate } = this.getDateRange(startMonthYear, endMonthYear);

    const analyticsMap = {
      monthlyRevenue: () => this.getMonthlyRevenue(sellerIdInt, startDate, endDate),
      totalUsers: () => this.getTotalUniqueUsers(sellerIdInt, startDate, endDate),
      percentageOrdersLost: () => this.getPercentageOrdersLost(sellerIdInt, startDate, endDate),
      percentageOrdersGained: () => this.getPercentageOrdersGained(sellerIdInt, startDate, endDate),
      totalProducts: () => this.getTotalProducts(sellerIdInt),
      weeklyOrders: () => this.getWeeklyOrders(sellerIdInt),
      fulfilledOrders: () => this.getFulfilledOrders(sellerIdInt, startDate, endDate),
      recentOrders: () => this.getRecentOrders(sellerIdInt),
      totalRevenue: () => this.getTotalRevenue(sellerIdInt, startDate, endDate),
      averageMonthlyRevenue: () => this.getAverageMonthlyRevenue(sellerIdInt, startDate, endDate),
      totalOrdersFulfilled: () => this.getTotalOrdersFulfilled(sellerIdInt, startDate, endDate),
      totalOrdersCancelled: () => this.getTotalOrdersCancelled(sellerIdInt, startDate, endDate),
      topRevenueGeneratingProduct: () => this.getTopRevenueGeneratingProduct(sellerIdInt, startDate, endDate),
      topSellingProduct: () => this.getTopSellingProduct(sellerIdInt, startDate, endDate),
    };

    const analyticsFunction = analyticsMap[type];

    if (!analyticsFunction) {
      throw new Error('Invalid analytics type');
    }

    return await analyticsFunction();
  }

  //get a date range
  private getDateRange(startMonthYear?: string, endMonthYear?: string) {
    const startDate = startMonthYear
      ? new Date(`${startMonthYear}-01`)
      : subMonths(new Date(), 6);
    const endDate = endMonthYear
      ? endOfMonth(new Date(`${endMonthYear}-01`))
      : new Date();

    return { startDate, endDate };
  
  }

  //get monthly revenue map
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

    // Extract all product IDs from ordered items
    const productIds = new Set<string>();
    for (const order of orders) {
        const orderedItems = parseOrderedItems(order.orderedItems);
        for (const item of orderedItems) {
            productIds.add(item.productId);
        }
    }

    // Fetch all relevant products in a single query
    const products = await this.prisma.product.findMany({
        where: {
            id: { in: Array.from(productIds) },
            sellerId, // Filter by sellerId directly
        },
        select: {
            id: true,
            price: true,
        },
    });

    // Create a map for quick product lookup
    const productMap = new Map<string, number>();
    for (const product of products) {
        productMap.set(product.id, product.price);
    }

    // Calculate monthly revenue
    const monthlyRevenueMap = new Map<string, number>();
    
    for (const order of orders) {
        const orderedItems = parseOrderedItems(order.orderedItems);
        const orderMonth = startOfMonth(order.orderedAt).toISOString();

        for (const item of orderedItems) {
            const price = productMap.get(item.productId);
            if (price) {
                const revenue = price * item.quantity;
                const currentRevenue = monthlyRevenueMap.get(orderMonth) || 0;
                monthlyRevenueMap.set(orderMonth, currentRevenue + revenue);
            }
        }
    }

    // Convert the result to an array format
    const result = Array.from(monthlyRevenueMap.entries()).map(
        ([month, revenue]) => ({
            month,
            revenue,
        }),
    );

    return { data: result };
}

//get total unique traffic
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

  // Extract all product IDs from ordered items
  const productIds = new Set<string>();
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      for (const item of orderedItems) {
          productIds.add(item.productId);
      }
  }

  // Fetch all relevant products in a single query
  const products = await this.prisma.product.findMany({
      where: {
          id: { in: Array.from(productIds) },
          sellerId, // Filter by sellerId directly
      },
      select: {
          id: true,
      },
  });

  const validProductIds = new Set(products.map(product => product.id));
  const uniqueUserIds = new Set<number>();

  // Collect unique user IDs based on valid products
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      
      for (const item of orderedItems) {
          if (validProductIds.has(item.productId)) {
              uniqueUserIds.add(order.userId);
              break; // No need to check other items in the same order
          }
      }
  }

  return { data: { totalUsers: uniqueUserIds.size } };
}

//percentage orderloss
private async getPercentageOrdersLost(
  sellerId: number,
  startDate: Date,
  endDate: Date,
) {
  const previousStartDate = subMonths(startDate, 1);
  const previousEndDate = subMonths(endDate, 1);

  // Fetch counts for both current and previous periods in a single query
  const [currentOrdersCount, previousOrdersCount] = await Promise.all([
      this.countOrdersByStatus(sellerId, startDate, endDate, 'Cancelled'),
      this.countOrdersByStatus(sellerId, previousStartDate, previousEndDate, 'Cancelled'),
  ]);

  // Calculate the percentage change
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

  // Fetch counts for both current and previous periods in parallel
  const [currentOrdersCount, previousOrdersCount] = await Promise.all([
      this.countOrdersByStatus(sellerId, startDate, endDate, 'Completed'),
      this.countOrdersByStatus(sellerId, previousStartDate, previousEndDate, 'Completed'),
  ]);

  // Calculate the percentage change
  const percentageGained = this.calculatePercentageChange(
      previousOrdersCount,
      currentOrdersCount,
  );

  return { data: { percentageOrdersGained: percentageGained } };
}

//updated countorderbystatus
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

  // Extract all product IDs from ordered items
  const productIds = new Set<string>();
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      for (const item of orderedItems) {
          productIds.add(item.productId);
      }
  }

  // Fetch all relevant products in a single query
  const products = await this.prisma.product.findMany({
      where: {
          id: { in: Array.from(productIds) },
          sellerId, // Filter by sellerId directly
      },
      select: {
          id: true,
      },
  });

  // Create a set for quick lookup of valid product IDs
  const validProductIds = new Set(products.map(product => product.id));
  
  // Count unique orders with valid products
  let count = 0;
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      
      for (const item of orderedItems) {
          if (validProductIds.has(item.productId)) {
              count++;
              break; // No need to check other items in the same order
          }
      }
  }

  return count;
}

//calculate percentage change
private calculatePercentageChange(
  previousCount: number,
  currentCount: number,
): number {
  if (previousCount === 0) {
      return currentCount > 0 ? 100 : 0;
  }
  
  const change = ((currentCount - previousCount) / previousCount) * 100;
  return parseFloat(change.toFixed(2)); // Optional: Round to two decimal places for clarity
}

//get total products
  private async getTotalProducts(sellerId: number) {
    const totalProducts = await this.prisma.product.count({
      where: { sellerId },
    });
    return { data: { totalProducts } };
  }



//get weekly orders
private async getWeeklyOrders(sellerId: number) {
  const now = new Date();
  const startOfWeek = subDays(now, 7);

  // Fetch orders within the last week
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

  // Extract all product IDs from ordered items
  const productIds = new Set<string>();
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      for (const item of orderedItems) {
          productIds.add(item.productId);
      }
  }

  // Fetch all relevant products in a single query
  const products = await this.prisma.product.findMany({
      where: {
          id: { in: Array.from(productIds) },
          sellerId, // Filter by sellerId directly
      },
      select: {
          id: true,
      },
  });

  // Create a set for quick lookup of valid product IDs
  const validProductIds = new Set(products.map(product => product.id));

  // Count unique orders with valid products
  let orderCount = 0;
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      
      for (const item of orderedItems) {
          if (validProductIds.has(item.productId)) {
              orderCount++;
              break; // No need to check other items in the same order
          }
      }
  }

  return { data: { weeklyOrders: orderCount } };
}
  
  //get full filled orders
  private async getFulfilledOrders(
    sellerId: number,
    startDate: Date,
    endDate: Date,
) {
    // Fetch fulfilled orders within the specified date range
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

    // Extract all product IDs from ordered items
    const productIds = new Set<string>();
    for (const order of orders) {
        const orderedItems = parseOrderedItems(order.orderedItems);
        for (const item of orderedItems) {
            productIds.add(item.productId);
        }
    }

    // Fetch all relevant products in a single query
    const products = await this.prisma.product.findMany({
        where: {
            id: { in: Array.from(productIds) },
            sellerId, // Filter by sellerId directly
        },
        select: {
            id: true,
            sellerId: true,
        },
    });

    // Create a set for quick lookup of valid product IDs
    const validProductIds = new Set(products.map(product => product.id));

    // Count fulfilled orders by month
    const monthlyFulfilledMap = new Map<string, number>();
    
    for (const order of orders) {
        const orderedItems = parseOrderedItems(order.orderedItems);
        const orderMonth = startOfMonth(order.orderedAt).toISOString();

        for (const item of orderedItems) {
            if (validProductIds.has(item.productId)) {
                const currentCount = monthlyFulfilledMap.get(orderMonth) || 0;
                monthlyFulfilledMap.set(orderMonth, currentCount + 1);
                break; // No need to check other items in the same order
            }
        }
    }

    // Prepare the result
    const result = Array.from(monthlyFulfilledMap.entries()).map(
        ([month, count]) => ({
            month,
            fulfilledOrders: count,
        }),
    );

    return { data: result };
}

//get recent orders
private async getRecentOrders(sellerId: number) {
  // Fetch the most recent orders
  const orders = await this.prisma.order.findMany({
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

  // Extract all product IDs from ordered items
  const productIds = new Set<string>();
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      for (const item of orderedItems) {
          productIds.add(item.productId);
      }
  }

  // Fetch all relevant products in a single query
  const products = await this.prisma.product.findMany({
      where: {
          id: { in: Array.from(productIds) },
          sellerId, // Filter by sellerId directly
      },
      select: {
          id: true,
      },
  });

  // Create a set for quick lookup of valid product IDs
  const validProductIds = new Set(products.map(product => product.id));

  // Filter recent orders based on valid products
  const filteredOrders = orders.filter((order) => {
      const orderedItems = parseOrderedItems(order.orderedItems);
      return orderedItems.some(item => validProductIds.has(item.productId));
  });

  return { data: { recentOrders: filteredOrders } };
}

//get total revenue
private async getTotalRevenue(
  sellerId: number,
  startDate: Date,
  endDate: Date,
) {
  // Fetch orders within the specified date range
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

  // Extract all product IDs from ordered items
  const productIds = new Set<string>();
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      for (const item of orderedItems) {
          productIds.add(item.productId);
      }
  }

  // Fetch all relevant products in a single query
  const products = await this.prisma.product.findMany({
      where: {
          id: { in: Array.from(productIds) },
          sellerId, // Filter by sellerId directly
      },
      select: {
          id: true,
          price: true,
      },
  });

  // Create a map for quick lookup of product prices
  const productMap = new Map<string, number>();
  for (const product of products) {
      productMap.set(product.id, product.price);
  }

  // Calculate total revenue
  let totalRevenue = 0;
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
          const price = productMap.get(item.productId);
          if (price) {
              totalRevenue += price * item.quantity;
          }
      }
  }

  return { data: { totalRevenue } };
}


  //get monthly revenue
  private async getAverageMonthlyRevenue(
    sellerId: number,
    startDate: Date,
    endDate: Date,
) {
    // Get total revenue for the specified period
    const totalRevenueData = await this.getTotalRevenue(sellerId, startDate, endDate);
    const totalRevenue = totalRevenueData.data.totalRevenue;

    // Calculate the number of months between start and end dates
    const months = Math.max(
        1,
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth())
    );

    // Calculate average monthly revenue
    const averageRevenue = totalRevenue / months;

    return { data: { averageMonthlyRevenue: averageRevenue } };
}

//get total orders fulfilled
private async getTotalOrdersFulfilled(
  sellerId: number,
  startDate: Date,
  endDate: Date,
) {
  // Fetch fulfilled orders within the specified date range
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

  // Extract all product IDs from ordered items
  const productIds = new Set<string>();
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      for (const item of orderedItems) {
          productIds.add(item.productId);
      }
  }

  // Fetch all relevant products in a single query
  const products = await this.prisma.product.findMany({
      where: {
          id: { in: Array.from(productIds) },
          sellerId, // Filter by sellerId directly
      },
      select: {
          id: true,
          sellerId: true,
      },
  });

  // Create a set for quick lookup of valid product IDs
  const validProductIds = new Set(products.map(product => product.id));

  // Count fulfilled orders by checking valid products
  let fulfilledCount = 0;
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
          if (validProductIds.has(item.productId)) {
              fulfilledCount++;
              break; // No need to check other items in the same order
          }
      }
  }

  return { data: { totalOrdersFulfilled: fulfilledCount } };
}

//get total order cancel
private async getTotalOrdersCancelled(
  sellerId: number,
  startDate: Date,
  endDate: Date,
) {
  // Fetch cancelled orders within the specified date range
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

  // Extract all product IDs from ordered items
  const productIds = new Set<string>();
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);
      for (const item of orderedItems) {
          productIds.add(item.productId);
      }
  }

  // Fetch all relevant products in a single query
  const products = await this.prisma.product.findMany({
      where: {
          id: { in: Array.from(productIds) },
          sellerId, // Filter by sellerId directly
      },
      select: {
          id: true,
          sellerId: true,
      },
  });

  // Create a set for quick lookup of valid product IDs
  const validProductIds = new Set(products.map(product => product.id));

  // Count cancelled orders by checking valid products
  let cancelledCount = 0;
  for (const order of orders) {
      const orderedItems = parseOrderedItems(order.orderedItems);

      for (const item of orderedItems) {
          if (validProductIds.has(item.productId)) {
              cancelledCount++;
              break; // No need to check other items in the same order
          }
      }
  }

  return { data: { totalOrdersCancelled: cancelledCount } };
}


  //get top revenue generating product
  private async getTopRevenueGeneratingProduct(
    sellerId: number,
    startDate: Date,
    endDate: Date,
) {
    // Fetch orders within the specified date range
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

    // Extract all product IDs from ordered items
    const productIds = new Set<string>();
    for (const order of orders) {
        const orderedItems = parseOrderedItems(order.orderedItems);
        for (const item of orderedItems) {
            productIds.add(item.productId);
        }
    }

    // Fetch all relevant products in a single query
    const products = await this.prisma.product.findMany({
        where: {
            id: { in: Array.from(productIds) },
            sellerId, // Filter by sellerId directly
        },
        select: {
            id: true,
            price: true,
        },
    });

    // Create a map for quick lookup of product prices
    const productMap = new Map<string, number>();
    for (const product of products) {
        productMap.set(product.id, product.price);
    }

    // Calculate total revenue for each product
    const productRevenueMap = new Map<string, number>();
    
    for (const order of orders) {
        const orderedItems = parseOrderedItems(order.orderedItems);

        for (const item of orderedItems) {
            const price = productMap.get(item.productId);
            if (price) {
                const revenue = price * item.quantity;
                productRevenueMap.set(
                    item.productId,
                    (productRevenueMap.get(item.productId) || 0) + revenue,
                );
            }
        }
    }

    // Sort products by revenue and get the top 5
    const sortedProducts = Array.from(productRevenueMap.entries())
        .sort(([, revenueA], [, revenueB]) => revenueB - revenueA)
        .slice(0, 5);

    return { data: { topRevenueGeneratingProducts: sortedProducts } };
}


  //get top selling product
  private async getTopSellingProduct(
    sellerId: number,
    startDate: Date,
    endDate: Date,
) {
    // Fetch orders within the specified date range
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

    // Extract all product IDs from ordered items
    const productIds = new Set<string>();
    for (const order of orders) {
        const orderedItems = parseOrderedItems(order.orderedItems);
        for (const item of orderedItems) {
            productIds.add(item.productId);
        }
    }

    // Fetch all relevant products in a single query
    const products = await this.prisma.product.findMany({
        where: {
            id: { in: Array.from(productIds) },
            sellerId, // Filter by sellerId directly
        },
        select: {
            id: true,
            sellerId: true,
        },
    });

    // Create a set for quick lookup of valid product IDs
    const validProductIds = new Set(products.map(product => product.id));

    // Calculate total sales for each valid product
    const productSalesMap = new Map<string, number>();
    
    for (const order of orders) {
        const orderedItems = parseOrderedItems(order.orderedItems);

        for (const item of orderedItems) {
            if (validProductIds.has(item.productId)) {
                const currentSales = productSalesMap.get(item.productId) || 0;
                productSalesMap.set(item.productId, currentSales + item.quantity);
            }
        }
    }

    // Sort products by sales and get the top 5
    const sortedProducts = Array.from(productSalesMap.entries())
        .sort(([, salesA], [, salesB]) => salesB - salesA)
        .slice(0, 5);

    return { data: { topSellingProducts: sortedProducts } };
}

}
