import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'The ID of the user starting the chat',
    example: 1,
    type: Number,
  })
  @IsInt()
  @Min(1, { message: 'userId must be a positive integer' })
  readonly userId: number;

  @ApiProperty({
    description: 'The ID of the admin handling the chat',
    example: 1,
    type: Number,
  })
  @IsInt()
  @Min(1, { message: 'adminId must be a positive integer' })
  readonly adminId: number;
}
