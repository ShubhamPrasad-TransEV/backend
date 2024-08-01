import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('user')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    //Fetch users
    @Get('all')
    @ApiResponse({
        status: 200,
        description: 'Fetch all users with their roles',
    })
    async getAllUsers() {
        return this.registerService.getAllUsers();
    }

    //Register a new user
    @Post('register')
    @ApiBody({
        description: 'User registration payload',
        type: CreateUserDto,
        examples: {
            example1: {
                summary: 'New user example',
                value: {
                    username: 'newuser',
                    password: 'securepassword'
                },
            },
        },
    })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.registerService.register(createUserDto);
    }

    //Update user - Details
    @Patch('update')
    @ApiBody({
        description: 'User update payload',
        type: UpdateUserDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Update user details',
    })
    async updateUser(@Body() updateUserDto: UpdateUserDto) {
        return this.registerService.updateUser(updateUserDto);
    }
    
    //Deleting user
    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
    })
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.registerService.deleteUser(id);
    }
}
