import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportTicketDto {
  @ApiProperty({ description: 'Subject of the support ticket' })
  subject: string;

  @ApiProperty({ description: 'Detailed description of the support issue' })
  details: string;
}

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Status of the support ticket',
    enum: ['UNOPENED', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED'],
  })
  status: 'UNOPENED' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
}
