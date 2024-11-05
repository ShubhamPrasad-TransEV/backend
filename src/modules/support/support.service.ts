import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupportTicketDto } from './dto/support.dto';
import { UpdateStatusDto } from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createSupportTicket(
    userId: number,
    createSupportTicketDto: CreateSupportTicketDto,
  ) {
    const ticket = await this.prisma.supportTicket.create({
      data: {
        ...createSupportTicketDto,
        userId,
        status: 'UNOPENED',
      },
      include: { user: true },
    });

    // Send email (email logic here as described earlier)

    return ticket;
  }

  async getTicketsByUser(userId: number) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async getTicketsByCreatedDate(createdAt: Date) {
    return this.prisma.supportTicket.findMany({
      where: { createdAt },
      include: { user: true },
    });
  }

  async getTicketsByUpdatedDate(updatedAt: Date) {
    return this.prisma.supportTicket.findMany({
      where: { updatedAt },
      include: { user: true },
    });
  }

  async getTicketById(ticketId: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { user: true },
    });
  }

  async updateTicketStatus(ticketId: string, updateStatusDto: UpdateStatusDto) {
    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: updateStatusDto.status },
    });
  }
}
