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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiConsumes,
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

  // Add an address for a user
  @Post(':id/address')
  @ApiOperation({ summary: 'Add a new address to user profile' })
  @ApiBody({
    description: 'Address details to add to the user profile',
    type: AddressDto,
  })
  @ApiResponse({ status: 201, description: 'Address successfully added.' })
  @ApiParam({ name: 'id', description: 'User ID', example: 123 })
  async addAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() addressDto: AddressDto,
  ) {
    return this.registerService.addAddress(id, addressDto);
  }

  // Upload a profile picture
  @Post(':id/profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      limits: { fileSize: 500 * 1024 }, // Limit 500 KB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpeg|png|gif)/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile picture upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Profile picture uploaded successfully',
  })
  async uploadProfilePicture(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = path.join('uploads/profile-pictures', file.filename);
    return await this.registerService.saveProfilePicturePath(id, filePath);
  }

  // Get a user's profile picture
  @Get(':id/profile-picture')
  @ApiResponse({
    status: 200,
    description: 'Returns the profile picture in MIME-prefixed Base64 format',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile picture not found',
  })
  async getProfilePicture(@Param('id', ParseIntPipe) id: number) {
    return this.registerService.getProfilePictureBase64(id);
  }
}
