import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'username' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'securepassword' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
