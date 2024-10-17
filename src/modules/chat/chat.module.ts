import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '../../prisma/prisma.service';  

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, PrismaService],  
})
export class ChatModule {}
