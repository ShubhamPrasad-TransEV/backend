import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  
  async createChat(userId: number, adminId: number) {
    console.log(`Creating chat for userId: ${userId}, adminId: ${adminId}`);
    return this.prisma.chat.create({
        data: {
            userId: userId,
            adminId: adminId,
        },
    });
}


  async getChatById(chatId: number) {
    return this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });
  }


  async sendMessage(chatId: number, sender: string, content: string) {
    return this.prisma.message.create({
      data: {
        chatId,
        sender,
        content,
      },
    });
  }


  async getMessages(chatId: number) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
