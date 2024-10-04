import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The ID of the seller, admin, or user',
    example: 1,
    type: Number,
  })
  @IsInt()
  @Min(1, { message: 'ID must be a positive integer' })
  readonly id: number;

  @ApiProperty({
    description: 'The notification message',
    example: 'Your account has been successfully created!',
    type: String,
  })
  @IsString()
  readonly message: string;
}
