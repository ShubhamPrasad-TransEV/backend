import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  async createChat(@Body() createChatDto: CreateChatDto) {
    const { userId, adminId } = createChatDto;
    return this.chatService.createChat(userId, adminId);
  }

  @Get(':id')
  async getChatById(@Param('id') id: number) {
    return this.chatService.getChatById(id);
  }

  @Post(':id/message')
  async sendMessage(
    @Param('id') id: number,
    @Body() sendMessageDto: SendMessageDto
  ) {
    const { sender, content } = sendMessageDto;
    return this.chatService.sendMessage(id, sender, content);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: number) {
    return this.chatService.getMessages(id);
  }
}
