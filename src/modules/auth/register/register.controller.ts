import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('user')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    //Fetch users
    @Get('all')
    @ApiResponse({
        status: 200,
        description: 'Fetch all users with their roles',
    })
    async getAllUsers() {
        return this.registerService.getAllUsers();
    }

     // Fetch all sellers
     @Get('sellers')
     @ApiResponse({
         status: 200,
         description: 'Fetch all sellers',
     })
     async getAllSellers() {
         return this.registerService.getAllSellers();
     }

     @Get('users')
     @ApiResponse({
         status: 200,
         description: 'Fetch all users',
     })
     async getUsers() {
         return this.registerService.getUsers();
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
                    password: 'securepassword',
                    email: 'HkNfZ@example.com',
                },
            },
        },
    })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.registerService.register(createUserDto);
    }

    // Update user details
    @Patch('update')
    @ApiBody({
        description: 'User update payload',
        type: UpdateUserDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Update user details',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
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

    @Get(':id')
    async getProfile(@Param('id') id: string) {
        const userId = parseInt(id, 10); // Ensure id is an integer
  if (isNaN(userId)) {
    throw new BadRequestException('Invalid user ID');
  }
  return this.registerService.findOne(userId);
}

}
