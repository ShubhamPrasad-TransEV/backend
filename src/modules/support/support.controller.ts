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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiBody({
    type: CreateSupportTicketDto,
    description: 'Support ticket creation data',
  })
  async createSupportTicket(
    @Body() createSupportTicketDto: CreateSupportTicketDto,
  ) {
    return this.supportService.createSupportTicket(createSupportTicketDto);
  }

  @Get('by-user')
  @ApiOperation({ summary: 'Get all support tickets by user ID' })
  @ApiQuery({
    name: 'user_id',
    description: 'ID of the user to filter tickets by',
    required: true,
  })
  async getTicketsByUser(@Query('user_id') user_id: number) {
    return this.supportService.getTicketsByUser(user_id);
  }

  @Get('by-created-date')
  @ApiOperation({ summary: 'Get all support tickets by created date' })
  @ApiQuery({
    name: 'createdAt',
    description: 'Creation date to filter tickets by',
    required: true,
  })
  async getTicketsByCreatedDate(@Query('createdAt') createdAt: Date) {
    return this.supportService.getTicketsByCreatedDate(createdAt);
  }

  @Get('by-updated-date')
  @ApiOperation({ summary: 'Get all support tickets by updated date' })
  @ApiQuery({
    name: 'updatedAt',
    description: 'Updated date to filter tickets by',
    required: true,
  })
  async getTicketsByUpdatedDate(@Query('updatedAt') updatedAt: Date) {
    return this.supportService.getTicketsByUpdatedDate(updatedAt);
  }

  @Get(':ticket_id')
  @ApiOperation({ summary: 'Get a support ticket by its ID' })
  @ApiParam({ name: 'ticket_id', description: 'ID of the support ticket' })
  async getTicketById(@Param('ticket_id') ticket_id: string) {
    return this.supportService.getTicketById(ticket_id);
  }

  @Patch('update-status')
  @ApiOperation({ summary: 'Update the status of a support ticket' })
  @ApiBody({
    type: UpdateStatusDto,
    description: 'Updated status for the ticket',
  })
  async updateTicketStatus(@Body() updateStatusDto: UpdateStatusDto) {
    return this.supportService.updateTicketStatus(updateStatusDto);
  }


@Get()
@ApiOperation({ summary: 'Get all support tickets' })
async getAllTickets() {
  return this.supportService.getAllTickets();
}

}

