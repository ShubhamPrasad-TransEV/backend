import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper method to check if products exist in the database
  private async validateProducts(orderedItems: Record<string, number>): Promise<string[]> {
    const productIds = Object.keys(orderedItems);
    
    // Fetch products that exist in the database
    const existingProducts = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: { id: true },
    });

    // Extract existing product IDs
    const existingProductIds = existingProducts.map(product => product.id);

    // Find product IDs that are missing
    const missingProductIds = productIds.filter(id => !existingProductIds.includes(id));

    return missingProductIds;
  }

  // Create a new order
  async create(createOrderDto: CreateOrderDto) {
    // Validate if all products in orderedItems exist
    const missingProductIds = await this.validateProducts(createOrderDto.orderedItems);

    if (missingProductIds.length > 0) {
      throw new BadRequestException(`The following product IDs are not valid: ${missingProductIds.join(', ')}`);
    }

    // Create the order if all products are valid
    return this.prisma.order.create({
      data: {
        user: {
          connect: { id: createOrderDto.userId },
        },
        orderedItems: createOrderDto.orderedItems,
        shipmentCompany: createOrderDto.shipmentCompany,
        shipmentRequestStatus: createOrderDto.shipmentRequestStatus,
        shipmentStatus: createOrderDto.shipmentStatus,
        invoice: createOrderDto.invoice,
        refundStatus: createOrderDto.refundStatus,
        refundDetails: createOrderDto.refundDetails,
        shippingCost: createOrderDto.shippingCost,
        orderingStatus: createOrderDto.orderingStatus,
        orderFulfillmentStatus: createOrderDto.orderFulfillmentStatus,
        prePayment: createOrderDto.prePayment,
        paymentStatus: createOrderDto.paymentStatus,
      },
    });
  }

  // Get all orders
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
      },
    });
  }

  // Get a single order by ID
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  // Update an existing order
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // Find the order to ensure it exists before updating
    const existingOrder = await this.prisma.order.findUnique({ where: { id } });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (updateOrderDto.orderedItems) {
      // Validate if all products in orderedItems exist
      const missingProductIds = await this.validateProducts(updateOrderDto.orderedItems);

      if (missingProductIds.length > 0) {
        throw new BadRequestException(`The following product IDs are not valid: ${missingProductIds.join(', ')}`);
      }
    }

    // Update the order
    return this.prisma.order.update({
      where: { id },
      data: {
        orderedItems: updateOrderDto.orderedItems,
        shipmentCompany: updateOrderDto.shipmentCompany,
        shipmentRequestStatus: updateOrderDto.shipmentRequestStatus,
        shipmentStatus: updateOrderDto.shipmentStatus,
        invoice: updateOrderDto.invoice,
        refundStatus: updateOrderDto.refundStatus,
        refundDetails: updateOrderDto.refundDetails,
        shippingCost: updateOrderDto.shippingCost,
        orderingStatus: updateOrderDto.orderingStatus,
        orderFulfillmentStatus: updateOrderDto.orderFulfillmentStatus,
        prePayment: updateOrderDto.prePayment,
        paymentStatus: updateOrderDto.paymentStatus,
      },
    });
  }

  // Delete an order
  async remove(id: number) {
    // Check if the order exists before attempting to delete
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
