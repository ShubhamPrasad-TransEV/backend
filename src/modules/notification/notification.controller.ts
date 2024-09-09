import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common'; // Add this line

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('sellers/:id')
  async getNotifications(@Param('id') id: string) {
    const sellerId = parseInt(id, 10);
    try {
      const result = await this.notificationService.getNotifications(sellerId);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('sellers/:id')
  async createNotification(
    @Param('id') id: string,
    @Body() createNotificationDto: CreateNotificationDto
  ) {
    createNotificationDto.sellerId = parseInt(id, 10);
    try {
      const result = await this.notificationService.createNotification(createNotificationDto);
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
