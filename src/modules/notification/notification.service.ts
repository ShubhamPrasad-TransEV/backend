import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(sellerId: number) {
    // Check if the seller exists
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${sellerId} does not exist`);
    }

    const notifications = await this.prisma.notification.findMany({
      where: { sellerId },
    });

    return {
      statusCode: notifications.length > 0 ? 200 : 204,
      message: notifications.length > 0
        ? 'Notifications retrieved successfully.'
        : 'No notifications available for the seller.',
      data: notifications,
    };
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const { sellerId } = createNotificationDto;

    // Check if the seller exists
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new BadRequestException(`Seller with ID ${sellerId} does not exist`);
    }

    // Create a new notification
    const notification = await this.prisma.notification.create({
      data: createNotificationDto,
    });

    return {
      statusCode: 201,
      message: 'Notification created successfully.',
      data: notification,
    };
  }
}
