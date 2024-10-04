import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  // Create an order
  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        shipmentStatus: createOrderDto.shipmentStatus,
        invoice: createOrderDto.invoice,
        refundStatus: createOrderDto.refundStatus,
        shippingCost: createOrderDto.shippingCost,
        orderingStatus: createOrderDto.orderingStatus,
        orderFulfillmentStatus: createOrderDto.orderFulfillmentStatus,
        prePayment: createOrderDto.prePayment,
        paymentStatus: createOrderDto.paymentStatus,
        // Connect user via userId
        user: {
          connect: { id: createOrderDto.userId },
        },
      },
    });
  }

  // Get all orders
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true, // Include the user details
        orderItems: {
          include: {
            product: true, // Include product details in each order item
          },
        },
      },
    });
  }

  // Get a single order by ID
  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true, // Include product details in the order item
          },
        },
      },
    });
  }

  // Update an order
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: {
        shipmentStatus: updateOrderDto.shipmentStatus,
        invoice: updateOrderDto.invoice,
        refundStatus: updateOrderDto.refundStatus,
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
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
