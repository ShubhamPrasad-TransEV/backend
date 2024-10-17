import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNumber()
  sellerId: number;

  @IsString()
  mainCategory: string;

  @IsString()
  subCategory: string;

  @IsString()
  nestedSubCategory: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageData)
  images: ImageData[];
}
