import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSellerDto } from './dto/update-seller.dto'; // Import the new DTO

@ApiTags('Users')
@Controller('user')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

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

    // Update seller details
    @Patch('sellers/update')
    @ApiBody({
        description: 'Update seller payload',
        type: UpdateSellerDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Update seller details',
    })
    @ApiResponse({
        status: 404,
        description: 'Seller not found',
    })
    async updateSeller(@Body() updateSellerDto: UpdateSellerDto) {
        return this.registerService.updateSeller(updateSellerDto);
    }

    // Delete a seller by ID
    @Delete('sellers/:id')
    @ApiResponse({
        status: 200,
        description: 'Seller deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Seller not found',
    })
    async deleteSeller(@Param('id', ParseIntPipe) id: number) {
        const result = await this.registerService.deleteSeller(id);
        if (!result) {
            throw new NotFoundException(`Seller with ID ${id} not found`);
        }
        return { message: 'Seller deleted successfully' };
    }
}
