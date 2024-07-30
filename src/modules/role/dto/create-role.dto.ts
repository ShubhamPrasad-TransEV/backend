import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from 'class-validator';
import { RoleEnum } from "../role.enum";



//Example payload 
// "name : "Admin"




export class CreateRoleDto {
    @ApiProperty({
        description: 'The name of the role',
        example: 'Admin',
        enum: RoleEnum,
    })
    @IsString()
    @IsEnum(RoleEnum, { message: 'Role must be one of the predefined roles(Admin, User, Seller)' })
    name: RoleEnum;
}