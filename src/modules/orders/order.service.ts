import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderedItemDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client'; // Import Prisma types

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

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

  // Helper method to check if products exist
  private async validateProducts(
    orderedItems: CreateOrderDto['orderedItems'],
  ): Promise<string[]> {
    const productIds = orderedItems.map((item) => item.productId);

    // Fetch products that exist
    const existingProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    const existingProductIds = existingProducts.map((product) => product.id);
    const missingProductIds = productIds.filter(
      (id) => !existingProductIds.includes(id),
    );

    return missingProductIds;
  }

  // Create an order
  async create(createOrderDto: CreateOrderDto) {
    const missingProductIds = await this.validateProducts(
      createOrderDto.orderedItems,
    );

    if (missingProductIds.length > 0) {
      throw new BadRequestException(
        `Invalid product IDs: ${missingProductIds.join(', ')}`,
      );
    }

    const orderItemsWithUnits: OrderedItemDto[] = [];
    let totalItemCost = 0;

    for (const orderedItem of createOrderDto.orderedItems) {
      const { productId, quantity, priceAfterDiscount } = orderedItem;

      // Fetch the product price if `priceAfterDiscount` is not provided
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { price: true },
      });

      if (!product) {
        throw new BadRequestException(`Product with ID ${productId} not found`);
      }

      // Use `priceAfterDiscount` if provided; otherwise, calculate it
      const itemCost = priceAfterDiscount ?? product.price * quantity;
      totalItemCost += itemCost;

      // Fetch available units for the product
      const availableUnits = await this.prisma.unit.findMany({
        where: { productId },
        take: quantity,
      });

      if (availableUnits.length < quantity) {
        throw new BadRequestException(
          `Not enough units for product ID: ${productId}`,
        );
      }

      const assignedUnits = availableUnits.map((unit) => unit.id);
      orderItemsWithUnits.push({
        productId,
        quantity,
        assignedUnits,
        priceAfterDiscount: itemCost,
      });

      // Update product quantity in inventory
      await this.prisma.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      });

      // Delete assigned units from the inventory
      await this.prisma.unit.deleteMany({
        where: { id: { in: assignedUnits } },
      });
    }

    // Use provided `totalItemCost` and `totalOrderCost` if available, otherwise calculate
    const finalTotalItemCost = createOrderDto.totalItemCost ?? totalItemCost;
    const shippingCost = createOrderDto.shippingCost || 0;
    const finalTotalOrderCost =
      createOrderDto.totalOrderCost ?? finalTotalItemCost + shippingCost;

    const order = await this.prisma.order.create({
      data: {
        user: { connect: { id: createOrderDto.userId } },
        orderedItems: orderItemsWithUnits as unknown as Prisma.JsonValue, // Convert ordered items to JSON
        shipmentCompany: createOrderDto.shipmentCompany,
        shipmentStatus: createOrderDto.shipmentStatus,
        paymentStatus: createOrderDto.paymentStatus,
        shippingCost: shippingCost,
        totalItemCost: finalTotalItemCost, // Use the final calculated or passed total item cost
        totalOrderCost: finalTotalOrderCost, // Use the final calculated or passed total order cost
      },
    });

    return order;
  }

  // Update an order
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUnique({ where: { id } });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Remove undefined fields from the updateOrderDto
    const updateData = Object.fromEntries(
      Object.entries(updateOrderDto).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    // Prevent updating `orderedItems` or core properties
    if (updateOrderDto.orderedItems) {
      throw new BadRequestException(
        'You cannot modify the ordered items of an order.',
      );
    }

    // Ensure that core fields are not updated (like `orderedItems` and `id`)
    delete updateData.orderedItems; // Disallow updates to orderedItems
    delete updateData.id; // Disallow updates to the ID

    // Calculate the total cost if shippingCost is provided
    const totalOrderCost =
      existingOrder.totalItemCost +
      (updateOrderDto.shippingCost || existingOrder.shippingCost);

    return this.prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        totalOrderCost, // Update the totalOrderCost if shippingCost changes
      },
    });
  }

  // Delete an order
  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Cast the retrieved JSON to OrderedItemDto[]
    const orderItems: OrderedItemDto[] =
      order.orderedItems as unknown as OrderedItemDto[];

    for (const item of orderItems) {
      const { productId, assignedUnits } = item;

      // Restore units
      await this.prisma.unit.createMany({
        data: assignedUnits.map((unitId) => ({
          id: unitId,
          productId: productId,
        })),
      });

      // Update product quantity
      await this.prisma.product.update({
        where: { id: productId },
        data: { quantity: { increment: assignedUnits.length } },
      });
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }
}


