import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
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

    @IsString()
    email: string;

    @ApiProperty({ example: 2, description: 'Role ID for the user', required: false })
    @IsOptional()
    @IsInt()
    roleId?: number;
}
