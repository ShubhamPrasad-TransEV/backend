import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Matches, IsInt } from 'class-validator';

export class UpdateAdminSettingsDto {
  @ApiProperty({
    description: 'The ID of the admin to whom these settings belong',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'Admin ID must be a number' })
  readonly adminId: number;

  @ApiProperty({
    description: 'The name of the site',
    example: 'Example Site',
    type: String,
  })
  @IsString()
  readonly siteName: string;

  @ApiProperty({
    description: 'The URL for the site logo',
    example: 'https://example.com/logo.png',
    type: String,
  })
  @IsString()
  readonly siteLogo: string;

  @ApiProperty({
    description: 'The address of the site',
    example: '123 Example Street, City, Country',
    type: String,
  })
  @IsString()
  readonly siteAddress: string;

  @ApiProperty({
    description: 'The email address of the site',
    example: 'contact@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly siteEmail: string;

  @ApiProperty({
    description: 'The phone number for the store (as a numeric string)',
    example: '1234567890',
    type: String,
  })
  @IsString({ message: 'Store phone must be a numeric string' })
  @Matches(/^\d+$/, { message: 'Store phone must contain only numbers' }) // Ensures only numeric characters are allowed
  readonly storePhone: string;
}
