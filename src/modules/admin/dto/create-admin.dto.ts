import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/modules/role/role.enum';


export class CreateAdminDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  email: string;

  @IsEnum(RoleEnum)
  role: RoleEnum = RoleEnum.ADMIN; // Default to Admin role
}
