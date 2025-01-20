import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const uploadDir = './profile-images';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Ensure the directory exists
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only JPEG, PNG images are allowed'), false);
        }
      },
    }),
  )
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    if (profileImage) {
      createAdminDto.profileImage = `${uploadDir}/${profileImage.filename}`;
    }
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
