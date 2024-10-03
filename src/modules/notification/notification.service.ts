import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const { id: userId, message } = createNotificationDto;

    // Fetch the user based on the userId
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user exists
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if the user has roleId 3, indicating they are a seller
    if (user.roleId !== 3) {
      throw new NotFoundException(`User with ID ${userId} is not a seller`);
    }

    // Ensure seller exists in the Seller table
    let seller = await this.prisma.seller.findUnique({
      where: { id: userId }, // Assuming userId is the sellerId
    });

    // If seller doesn't exist, create a new seller record
    if (!seller) {
      seller = await this.prisma.seller.create({
        data: {
          id: userId, // Use userId as sellerId
        },
      });
    }

    // Create a notification for the seller
    return this.prisma.notification.create({
      data: {
        sellerId: seller.id, // Use the seller's ID
        message: message,
      },
    });
  }

  async getNotificationById(id: number) {
    console.log(`Fetching notification with ID ${id}`); // Debugging line

    // Ensure id is an integer
    const notificationId = parseInt(id as unknown as string, 10);

    if (isNaN(notificationId)) {
      throw new NotFoundException(`Invalid notification ID ${id}`);
    }

    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      console.log(`Notification with ID ${notificationId} not found`); // Debugging line
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }

    return notification;
  }

  async getNotificationsBySellerId(sellerId: number) {
    // Ensure sellerId is valid
    if (isNaN(sellerId)) {
      throw new NotFoundException(`Invalid seller ID ${sellerId}`);
    }

    // Fetch notifications based on the sellerId
    const notifications = await this.prisma.notification.findMany({
      where: { sellerId: sellerId },
    });

    // If no notifications are found
    if (!notifications || notifications.length === 0) {
      throw new NotFoundException(
        `No notifications found for seller with ID ${sellerId}`,
      );
    }

    return notifications;
  }

  async deleteNotificationById(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.prisma.notification.delete({
      where: { id: id },
    });
  }
}
