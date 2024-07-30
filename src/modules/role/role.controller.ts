import { Body, Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService){}

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto){{
        return this.roleService.createRole(createRoleDto);
    }   
}








}
