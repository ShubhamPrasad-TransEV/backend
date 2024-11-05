export class CreateSupportTicketDto {
  subject: string;
  details: string;
}

export class UpdateStatusDto {
  status: 'UNOPENED' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
}
