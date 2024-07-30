import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('all')
    @ApiResponse({
        status: 200,
        description: 'Fetch all users with their roles',
    })
    async getAllUsers() {
        return this.userService.getAllUsers();
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
        return this.userService.register(createUserDto);
    }
}
