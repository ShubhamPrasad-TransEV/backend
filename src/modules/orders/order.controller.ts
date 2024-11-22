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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Orders') // Grouping all endpoints under 'Orders' in Swagger
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create an order
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  // Get all orders
  @Get()
  @ApiOperation({ summary: 'Retrieve all orders' })
  findAll() {
    return this.orderService.findAll();
  }

  // Get a single order by ID
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single order by its ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Order ID to retrieve' })
  @ApiBadRequestResponse({ description: 'Invalid order ID format' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  findOne(@Param('id') id: string) {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }
    return this.orderService.findOne(orderId);
  }

  // Update an order
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing order by its ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Order ID to update' })
  @ApiBadRequestResponse({ description: 'Invalid order ID format' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }
    return this.orderService.update(orderId, updateOrderDto);
  }

  // Delete an order
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by its ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Order ID to delete' })
  @ApiBadRequestResponse({ description: 'Invalid order ID format' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  remove(@Param('id') id: string) {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }
    return this.orderService.remove(orderId);
  }

  // Get orders by user ID
  @Get('user/:userId')
  @ApiOperation({
    summary: 'Retrieve all orders for a specific user by user ID',
  })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'User ID whose orders need to be retrieved',
  })
  @ApiBadRequestResponse({ description: 'Invalid user ID format' })
  @ApiNotFoundResponse({ description: 'User not found or no orders found' })
  findByUserId(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    return this.orderService.findByUserId(parsedUserId);
  }
}
