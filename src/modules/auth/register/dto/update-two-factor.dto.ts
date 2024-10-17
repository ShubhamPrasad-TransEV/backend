import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum } from 'class-validator';

export enum TwoFactorMethod {
  EMAIL = 'email',
  SMS = 'sms',
}

export class UpdateTwoFactorDto {
  @ApiProperty({
    description: 'Indicates whether 2FA is enabled',
    example: true,
  })
  @IsBoolean()
  twoFactorEnabled: boolean;

  @ApiProperty({
    description: 'Method for 2FA (email or sms)',
    example: 'email',
  })
  @IsEnum(TwoFactorMethod)
  twoFactorMethod: TwoFactorMethod;
}
