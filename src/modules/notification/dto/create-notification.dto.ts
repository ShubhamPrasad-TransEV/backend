import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  @IsNotEmpty()
  sellerId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
