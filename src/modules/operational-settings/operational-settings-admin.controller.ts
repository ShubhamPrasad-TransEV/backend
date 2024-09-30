import { Controller, Get, Post, Patch, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { OperationalSettingsService } from './operational-settings.service';
import { OperationalSettingsDto } from './dto/operational-settings.dto';

@Controller('admin/operational-settings')
export class OperationalSettingsController {
  constructor(private readonly operationalSettingsService: OperationalSettingsService) {}

  // Get the current operational settings for a specific admin by adminId
  @Get(':adminId')
  async getOperationalSettingsByAdminId(@Param('adminId') adminId: string) {
    const settings = await this.operationalSettingsService.getOperationalSettingsByAdminId(Number(adminId));
    if (!settings) {
      throw new NotFoundException(`Operational settings for Admin ID ${adminId} not found`);
    }
    return settings;
  }

  // Create new operational settings
  @Post()
  async createOperationalSettings(@Body() createOperationalSettingsDto: OperationalSettingsDto) {
    // Validate that the adminId exists in the Admins table
    const admin = await this.operationalSettingsService.getAdminByAdminId(createOperationalSettingsDto.adminId);
    if (!admin) {
      throw new BadRequestException(`Admin with ID ${createOperationalSettingsDto.adminId} does not exist`);
    }

    // Check if settings already exist for this admin
    const existingSettings = await this.operationalSettingsService.getOperationalSettingsByAdminId(createOperationalSettingsDto.adminId);
    if (existingSettings) {
      throw new BadRequestException('Operational settings for this admin already exist.');
    }

    return this.operationalSettingsService.createOperationalSettings(createOperationalSettingsDto);
  }

  // Update existing operational settings by adminId (PATCH)
  @Patch(':adminId')
  async updateOperationalSettings(
    @Param('adminId') adminId: string, 
    @Body() createOperationalSettingsDto: OperationalSettingsDto
  ) {
    // Ensure settings exist before updating
    const settings = await this.operationalSettingsService.getOperationalSettingsByAdminId(Number(adminId));
    if (!settings) {
      throw new NotFoundException(`Operational settings for Admin ID ${adminId} not found`);
    }

    return this.operationalSettingsService.updateOperationalSettings(Number(adminId), createOperationalSettingsDto);
  }
}
