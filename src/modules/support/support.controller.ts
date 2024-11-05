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
  @ApiBody({ type: CreateSupportTicketDto })
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
  @ApiOperation({ summary: 'Get all support tickets by user ID' })
  @ApiQuery({
    name: 'userId',
    description: 'ID of the user to filter tickets by',
    required: true,
  })
  async getTicketsByUser(@Query('userId') userId: number) {
    return this.supportService.getTicketsByUser(userId);
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

  @Get(':ticketId')
  @ApiOperation({ summary: 'Get a support ticket by its ID' })
  @ApiParam({ name: 'ticketId', description: 'ID of the support ticket' })
  async getTicketById(@Param('ticketId') ticketId: string) {
    return this.supportService.getTicketById(ticketId);
  }

  @Patch(':ticketId/status')
  @ApiOperation({ summary: 'Update the status of a support ticket' })
  @ApiParam({
    name: 'ticketId',
    description: 'ID of the support ticket to update',
  })
  @ApiBody({ type: UpdateStatusDto })
  async updateTicketStatus(
    @Param('ticketId') ticketId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.supportService.updateTicketStatus(ticketId, updateStatusDto);
  }
}
