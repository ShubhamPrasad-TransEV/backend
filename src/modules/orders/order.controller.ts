import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create an order
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  // Get all orders
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  // Get a single order by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }
    return this.orderService.findOne(orderId);
  }

  // Update an order
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }
    return this.orderService.update(orderId, updateOrderDto);
  }

  // Delete an order
  @Delete(':id')
  remove(@Param('id') id: string) {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }
    return this.orderService.remove(orderId);
  }
}
