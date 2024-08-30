import { Body, Controller, Get, Param, Post, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
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
                    name:'Puja Das',
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

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Fetch admin by ID',
        type: CreateAdminDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Admin not found',
    })
    async getAdminById(@Param('id', ParseIntPipe) id: number) {
        const admin = await this.adminService.getAdminById(id);
        if (!admin) {
            throw new NotFoundException(`Admin with ID ${id} not found`);
        }
        return admin;
    }
}
