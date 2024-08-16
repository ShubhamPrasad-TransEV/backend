import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 1, description: 'ID of the user to update' })
    @IsInt()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ example: 'newusername', description: 'Updated username of the user', required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ example: 'newemail@example.com', description: 'Updated email of the user', required: false })
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: 3, description: 'Role ID for the user (e.g., 3 for seller)', required: false })
    @IsOptional()
    @IsInt()
    roleId?: number;

    @ApiProperty({ example: 'New Company', description: 'Updated company name of the seller', required: false })
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiProperty({ example: 'A description of the seller', description: 'Updated description of the seller', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'John Doe', description: 'Updated contact person of the seller', required: false })
    @IsOptional()
    @IsString()
    contactPerson?: string;

    // @ApiProperty({ example: '1234567890', description: 'Updated phone number of the seller', required: false })
    // @IsOptional()
    // @IsString()
    // phoneNumber?: string;

    @ApiProperty({ example: '123 Main St', description: 'Updated address of the seller', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: true, description: 'Indicates if the user is a seller', required: false })
    @IsOptional()
    @IsBoolean()
    isSeller?: boolean;
}
