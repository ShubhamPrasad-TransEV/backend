import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

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
                    email: 'adminuser@gmail.com',
                    role: 'Admin',
                    companyName: 'Tech Corp',
                    description: 'A leading tech company',
                    contactPerson: 'Jane Doe',
                    phoneNumber: '1234567890',
                    address: '123 Tech Lane',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Admin user successfully created',
        type: CreateAdminDto,
    })
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.createAdmin(createAdminDto);
    }
}
