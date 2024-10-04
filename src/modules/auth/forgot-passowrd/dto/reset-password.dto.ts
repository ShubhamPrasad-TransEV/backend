import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'The reset OTP sent to the user' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ description: 'The new password for the user' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 50, {
    message: 'Password must be between 8 and 50 characters long',
  })
  newPassword: string;
}
