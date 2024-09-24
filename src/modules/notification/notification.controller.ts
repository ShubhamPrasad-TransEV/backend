import { Controller, Post, Get, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('create')
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      // Convert id to number before passing to service
      const notificationId = parseInt(id, 10);

      if (isNaN(notificationId)) {
        throw new NotFoundException(`Invalid notification ID ${id}`);
      }

      return await this.notificationService.getNotificationById(notificationId);
    } catch (error) {
      console.error(error.message); // Debugging line
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  @Get('seller/:sellerId')
  async getBySellerId(@Param('sellerId') sellerId: string) {
    try {
      // Convert sellerId to number before passing to service
      const id = parseInt(sellerId, 10);

      if (isNaN(id)) {
        throw new NotFoundException(`Invalid seller ID ${sellerId}`);
      }

      return await this.notificationService.getNotificationsBySellerId(id);
    } catch (error) {
      console.error(error.message); // Debugging line
      throw new NotFoundException(`Notifications for seller with ID ${sellerId} not found`);
    }
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    try {
      // Convert id to number before passing to service
      const notificationId = parseInt(id, 10);

      if (isNaN(notificationId)) {
        throw new NotFoundException(`Invalid notification ID ${id}`);
      }

      return await this.notificationService.deleteNotificationById(notificationId);
    } catch (error) {
      console.error(error.message); // Debugging line
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }
}
