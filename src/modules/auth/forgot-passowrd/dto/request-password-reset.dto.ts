import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  @ApiProperty({ description: 'The email address of the user requesting a password reset' })
  email: string;
}
