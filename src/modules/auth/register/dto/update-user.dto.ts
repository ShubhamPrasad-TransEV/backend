import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
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

    @ApiProperty({ example: 3, description: 'Role ID for the user (e.g., 3 for seller)', required: false })
    @IsOptional()
    @IsInt()
    roleId?: number;
}
