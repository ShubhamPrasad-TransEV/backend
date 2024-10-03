import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { UpdateAdminSettingsDto } from './dto/admin-settings.dto';

@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  // Get the current admin settings for a specific admin by adminId
  @Get(':adminId')
  async getAdminSettingsByAdminId(@Param('adminId') adminId: string) {
    const settings = await this.adminSettingsService.getAdminSettingsByAdminId(
      Number(adminId),
    );
    if (!settings) {
      throw new NotFoundException(
        `Admin settings for Admin ID ${adminId} not found`,
      );
    }
    return settings;
  }

  // Create new admin settings
  @Post()
  async createAdminSettings(
    @Body() createAdminSettingsDto: UpdateAdminSettingsDto,
  ) {
    // Validate that the adminId exists in the Admins table
    const admin = await this.adminSettingsService.getAdminByAdminId(
      createAdminSettingsDto.adminId,
    );
    if (!admin) {
      throw new BadRequestException(
        `Admin with ID ${createAdminSettingsDto.adminId} does not exist`,
      );
    }

    // Check if settings already exist for this admin
    const existingSettings =
      await this.adminSettingsService.getAdminSettingsByAdminId(
        createAdminSettingsDto.adminId,
      );

    // If settings already exist, throw an exception, otherwise proceed with creation
    if (existingSettings) {
      throw new BadRequestException(
        'Admin settings for this admin already exist.',
      );
    }

    // Proceed with creation if no settings exist
    return this.adminSettingsService.createAdminSettings(
      createAdminSettingsDto,
    );
  }

  // Update existing admin settings by adminId (PATCH)
  @Patch(':adminId')
  async updateAdminSettings(
    @Param('adminId') adminId: string,
    @Body() updateAdminSettingsDto: UpdateAdminSettingsDto,
  ) {
    // Ensure settings exist before updating
    const settings = await this.adminSettingsService.getAdminSettingsByAdminId(
      Number(adminId),
    );
    if (!settings) {
      throw new NotFoundException(
        `Admin settings for Admin ID ${adminId} not found`,
      );
    }

    return this.adminSettingsService.updateAdminSettings(
      Number(adminId),
      updateAdminSettingsDto,
    );
  }
}
