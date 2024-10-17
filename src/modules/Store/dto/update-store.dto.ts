import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly logo?: string; // Filename of the updated logo

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsString()
  readonly aboutUs?: string;
}
