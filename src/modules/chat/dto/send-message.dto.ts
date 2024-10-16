import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'The sender of the message (user or admin)',
    example: 'user',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Sender is required' })
  readonly sender: string;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, I need help with my order.',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  readonly content: string;
}
