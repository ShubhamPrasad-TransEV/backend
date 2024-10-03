import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsInt,
} from 'class-validator';

export class OperationalSettingsDto {
  @ApiProperty({
    description: 'The ID of the admin to whom these settings belong',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'Admin ID must be a number' })
  readonly adminId: number;

  @ApiProperty({
    description: 'Unique identifier for the operational settings',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @ApiProperty({
    description: 'The timezone for the operational settings',
    example: 'UTC+0',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly timeZone: string;

  @ApiProperty({
    description: 'The currency used in the application',
    example: 'USD',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly currency: string;

  @ApiProperty({
    description: 'The tax rate applied to orders (in percentage)',
    example: 10,
    type: Number,
  })
  @IsNumber()
  @Min(0, { message: 'Tax rate must be a non-negative number' })
  readonly taxRate: number;

  @ApiProperty({
    description: 'The minimum amount for free shipping',
    example: 50,
    type: Number,
  })
  @IsNumber()
  @Min(0, { message: 'Free shipping threshold must be a non-negative number' })
  readonly freeShippingThreshold: number;

  @ApiProperty({
    description: 'The expected time to process an order (in days)',
    example: 2,
    type: Number,
  })
  @IsNumber()
  @Min(0, { message: 'Order processing time must be a non-negative number' })
  readonly orderProcessingTime: number;

  @ApiProperty({
    description: 'Link to the Facebook page',
    example: 'https://facebook.com/yourpage',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly facebook?: string;

  @ApiProperty({
    description: 'Link to the Instagram profile',
    example: 'https://instagram.com/yourpage',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly instagram?: string;

  @ApiProperty({
    description: 'Link to the Twitter profile',
    example: 'https://twitter.com/yourpage',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly twitter?: string;

  @ApiProperty({
    description: 'The minimum amount required for placing an order',
    example: 10,
    type: Number,
  })
  @IsNumber()
  @Min(0, { message: 'Minimum order amount must be a non-negative number' })
  readonly minimumOrderAmount: number;

  @ApiProperty({
    description: 'The frequency of backups (e.g., Daily, Weekly)',
    example: 'Weekly',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly backupFrequency?: string;
}
