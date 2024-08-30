import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString,IsInt } from 'class-validator';
import { RoleEnum } from 'src/modules/role/role.enum';


export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;
  

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(RoleEnum)
  role: RoleEnum = RoleEnum.ADMIN;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  
  @IsString()
  @IsNotEmpty()
  name: string; // Ensure this is required

  @IsInt()
  @IsNotEmpty()
  id: number;  // ID must be an integer and cannot be empty

}
   

