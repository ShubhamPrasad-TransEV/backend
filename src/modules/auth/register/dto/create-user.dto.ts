import { IsString, IsNotEmpty, IsOptional, IsInt, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'newuser', description: 'Username of the user' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'securepassword', description: 'Password for the user' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'user@example.com', description: 'Email address of the user' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 2, description: 'Role ID for the user', required: false })
    @IsOptional()
    @IsInt()
    roleId?: number;

    // @ApiProperty({ example: '+1234567890', description: 'Phone number of the user', required: false })
    // @IsPhoneNumber(null) // You can specify a country code if needed
    // phone?: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number of the user', required: false })
    @IsOptional()
    @IsPhoneNumber(null) // You can specify a country code if needed
    phoneNumber?: string;

    @ApiProperty({ example: 'John Doe', description: 'Full name of the user', required: false })
    @IsOptional()
    @IsString()
    name?: string;
}
