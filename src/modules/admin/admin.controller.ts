import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    @ApiBody({
        description: 'Payload for ADMIN creation',
        type: CreateAdminDto,
        examples: {
            example1: {
                summary: 'Admin user example',
                value: {
                    username: 'adminuser',
                    password: 'securepassword',
                    role: 'Admin',
                },
            },
        },
    })
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.createAdmin(createAdminDto);
    }

}
