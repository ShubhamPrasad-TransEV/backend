import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('user')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Get('all')
    @ApiResponse({
        status: 200,
        description: 'Fetch all users with their roles',
    })
    async getAllUsers() {
        return this.registerService.getAllUsers();
    }

    @Post('register')
    @ApiBody({
        description: 'User registration payload',
        type: CreateUserDto,
        examples: {
            example1: {
                summary: 'New user example',
                value: {
                    username: 'newuser',
                    password: 'securepassword',
                    roleId: 2
                },
            },
        },
    })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.registerService.register(createUserDto);
    }
}
