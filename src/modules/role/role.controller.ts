import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }
    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        {
            return this.roleService.createRole(createRoleDto);
        }
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Fetch all roles',
    })
    async getAllRoles() {
        return this.roleService.getAllRoles();
    }


}
