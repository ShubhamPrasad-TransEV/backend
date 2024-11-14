// src/register/register.controller.ts

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { AddressDto } from './dto/address.dto';

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
    type: CreateUserDto,
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
    return seller.user;
  }

  // Fetch user profile by ID
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Fetch user profile by ID',
    type: CreateUserDto,
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
    const userId = parseInt(id, 10);
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

  @Post(':id/address')
  @ApiOperation({ summary: 'Add a new address to user profile' })
  @ApiBody({
    description: 'Address details to add to the user profile',
    type: AddressDto,
    examples: {
      example1: {
        summary: 'Home Address',
        value: {
          identifier: 'Home',
          address: '123 Main St, Springfield, USA',
        },
      },
      example2: {
        summary: 'Office Address',
        value: {
          identifier: 'Office',
          address: '456 Elm St, Springfield, USA',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Address successfully added.' })
  @ApiParam({ name: 'id', description: 'User ID', example: 123 })
  async addAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() addressDto: AddressDto,
  ) {
    return this.registerService.addAddress(id, addressDto);
  }

  // Delete address from user profile by identifier
  @Delete(':id/address/:identifier')
  @ApiOperation({ summary: 'Delete an address from user profile' })
  @ApiResponse({ status: 200, description: 'Address successfully deleted.' })
  @ApiParam({ name: 'id', description: 'User ID', example: 123 })
  @ApiParam({
    name: 'identifier',
    description: 'Address identifier (e.g., Home, Office)',
    example: 'Home',
  })
  async deleteAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('identifier') identifier: string,
  ) {
    return this.registerService.deleteAddress(id, identifier);
  }

  // Get all addresses for a user
  @Get(':id/address')
  @ApiOperation({ summary: 'Get all addresses for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of all addresses for the user.',
    schema: {
      example: [
        {
          identifier: 'Home',
          address: '123 Main St, Springfield, USA',
          default: true,
        },
        {
          identifier: 'Office',
          address: '456 Elm St, Springfield, USA',
          default: false,
        },
      ],
    },
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 123 })
  async getAllAddresses(@Param('id', ParseIntPipe) id: number) {
    return this.registerService.getAllAddresses(id);
  }

  // Get address by identifier for a user
  @Get(':id/address/:identifier')
  @ApiOperation({ summary: 'Get address by identifier for a user' })
  @ApiResponse({
    status: 200,
    description: 'Address details for the specified identifier.',
    schema: {
      example: {
        identifier: 'Home',
        address: '123 Main St, Springfield, USA',
        default: true,
      },
    },
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 123 })
  @ApiParam({
    name: 'identifier',
    description: 'Address identifier (e.g., Home, Office)',
    example: 'Home',
  })
  async getAddressByIdentifier(
    @Param('id', ParseIntPipe) id: number,
    @Param('identifier') identifier: string,
  ) {
    return this.registerService.getAddressByIdentifier(id, identifier);
  }

  // Update address by identifier for a user
  @Patch(':id/address/:identifier')
  @ApiOperation({ summary: 'Update an address by identifier for a user' })
  @ApiBody({
    description: 'Updated address details',
    type: AddressDto,
    examples: {
      example1: {
        summary: 'Updated Home Address',
        value: {
          identifier: 'Home',
          address: '789 New Address St, Springfield, USA',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Address successfully updated.' })
  @ApiParam({ name: 'id', description: 'User ID', example: 123 })
  @ApiParam({
    name: 'identifier',
    description: 'Address identifier (e.g., Home, Office)',
    example: 'Home',
  })
  async updateAddressByIdentifier(
    @Param('id', ParseIntPipe) id: number,
    @Param('identifier') identifier: string,
    @Body() addressDto: AddressDto,
  ) {
    return this.registerService.updateAddressByIdentifier(
      id,
      identifier,
      addressDto,
    );
  }

  @Patch(':id/address/:identifier/set-default')
  @ApiOperation({ summary: 'Set an address as the default address for a user' })
  @ApiResponse({
    status: 200,
    description: 'Address set as default successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found for the specified identifier.',
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 123 })
  @ApiParam({
    name: 'identifier',
    description: 'Address identifier (e.g., Home, Office)',
    example: 'Home',
  })
  async setDefaultAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('identifier') identifier: string,
  ) {
    return this.registerService.setDefaultAddress(id, identifier);
  }
}
