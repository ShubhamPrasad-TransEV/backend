import { Controller, Get, Post, Patch, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { UpdateAdminSettingsDto } from './dto/admin-settings.dto';

@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  // Get the current admin settings
  @Get()
  async getAdminSettings() {
    const settings = await this.adminSettingsService.getAdminSettings();
    if (!settings) {
      throw new NotFoundException('Admin settings not found');
    }
    return settings;
  }

  // Get admin settings by ID
  @Get(':id')
  async getAdminSettingsById(@Param('id') id: string) {
    const settings = await this.adminSettingsService.getAdminSettingsById(Number(id));
    if (!settings) {
      throw new NotFoundException(`Admin settings with ID ${id} not found`);
    }
    return settings;
  }

  // Create new admin settings (POST)
  @Post()
  async createAdminSettings(@Body() createAdminSettingsDto: UpdateAdminSettingsDto) {
    return this.adminSettingsService.createAdminSettings(createAdminSettingsDto);
  }

  // Update existing admin settings (PATCH)
  @Patch(':id')
  async updateAdminSettings(@Param('id') id: string, @Body() updateAdminSettingsDto: UpdateAdminSettingsDto) {
    return this.adminSettingsService.updateAdminSettings(Number(id), updateAdminSettingsDto);
  }
}
