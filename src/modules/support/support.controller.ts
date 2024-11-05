import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportTicketDto, UpdateStatusDto } from './dto/support.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('create')
  async createSupportTicket(
    @Body('userId') userId: number,
    @Body() createSupportTicketDto: CreateSupportTicketDto,
  ) {
    return this.supportService.createSupportTicket(
      userId,
      createSupportTicketDto,
    );
  }

  @Get('by-user')
  async getTicketsByUser(@Query('userId') userId: number) {
    return this.supportService.getTicketsByUser(userId);
  }

  @Get('by-created-date')
  async getTicketsByCreatedDate(@Query('createdAt') createdAt: Date) {
    return this.supportService.getTicketsByCreatedDate(createdAt);
  }

  @Get('by-updated-date')
  async getTicketsByUpdatedDate(@Query('updatedAt') updatedAt: Date) {
    return this.supportService.getTicketsByUpdatedDate(updatedAt);
  }

  @Get(':ticketId')
  async getTicketById(@Param('ticketId') ticketId: string) {
    return this.supportService.getTicketById(ticketId);
  }

  @Patch(':ticketId/status')
  async updateTicketStatus(
    @Param('ticketId') ticketId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.supportService.updateTicketStatus(ticketId, updateStatusDto);
  }
}
