import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@ApiTags('Users')
@Controller('user')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    // Fetch all users
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

    // Fetch seller by ID
    @Get('sellers/:id')
    @ApiResponse({
        status: 200,
        description: 'Fetch seller by ID',
        type: CreateUserDto, // This should match the actual response type
    })
    @ApiResponse({
        status: 404,
        description: 'Seller not found',
    })
    async getSellerById(@Param('id', ParseIntPipe) id: number) {
        const seller = await this.registerService.getSellerById(id);
        if (!seller) {
            throw new NotFoundException(`Seller with ID ${id} not found`);
        }
        return seller;
    }

    // Fetch user profile by ID
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Fetch user profile by ID',
        type: CreateUserDto, // This should match the actual response type
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid user ID',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async getProfile(@Param('id') id: string) {
        const userId = parseInt(id, 10); // Ensure id is an integer
        if (isNaN(userId)) {
            throw new BadRequestException('Invalid user ID');
        }
        const user = await this.registerService.findOne(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }

    // Register a new user
    @Post('register')
    @ApiBody({
        description: 'User registration payload',
        type: CreateUserDto,
        examples: {
            example1: {
                summary: 'New user example',
                value: {
                    name: 'esha ghosal',
                    username: 'newuser',
                    password: 'securepassword',
                    email: 'HkNfZ@example.com',
                    phoneNumber: '876543210',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: CreateUserDto,
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
        description: 'User details updated successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async updateUser(@Body() updateUserDto: UpdateUserDto) {
        const user = await this.registerService.updateUser(updateUserDto);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Delete user by ID
    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found',
    })
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        const result = await this.registerService.deleteUser(id);
        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return { message: 'User deleted successfully' };
    }

    // Update seller details
@Patch('sellers/update')
@ApiBody({
    description: 'Update seller payload',
    type: UpdateSellerDto,
})
@ApiResponse({
    status: 200,
    description: 'Seller details updated successfully',
})
@ApiResponse({
    status: 404,
    description: 'Seller not found',
})
async updateSeller(@Body() updateSellerDto: UpdateSellerDto) {
    const seller = await this.registerService.updateSeller(updateSellerDto);
    if (!seller) {
        throw new NotFoundException('Seller not found');
    }
    return seller;
}

}
