import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Clothing',
    description: 'Name of the category',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: ["Men's Fashion"],
    description: 'List of parent category names, if applicable',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  parentCategoryNames?: string[]; // List of parent category names

  @ApiProperty({
    example: ['Accessories'],
    description: 'List of child category names, if applicable',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  childCategoryNames?: string[]; // List of child category names
}
