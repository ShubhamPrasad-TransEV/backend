import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupportTicketDto, UpdateStatusDto } from './dto/support.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createSupportTicket(createSupportTicketDto: CreateSupportTicketDto) {
    const { user_id, subject, details } = createSupportTicketDto;

    // Create ticket in the database
    const ticket = await this.prisma.supportTicket.create({
      data: {
        userId: user_id,
        subject,
        details,
        status: 'UNOPENED',
      },
      include: { user: true },
    });

    // Send email (email logic here as described previously)

    return ticket;
  }

  async getTicketsByUser(user_id: number) {
    return this.prisma.supportTicket.findMany({
      where: { userId: Number(user_id) },
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

  async getTicketById(ticket_id: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id: ticket_id },
      include: { user: true },
    });
  }

  async updateTicketStatus(updateStatusDto: UpdateStatusDto) {
    const { ticket_id, status } = updateStatusDto;

    return this.prisma.supportTicket.update({
      where: { id: ticket_id },
      data: { status },
    });
  }
}
