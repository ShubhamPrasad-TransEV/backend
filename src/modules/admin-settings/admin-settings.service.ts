import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAdminSettingsDto } from './dto/admin-settings.dto';

@Injectable()
export class AdminSettingsService {
  constructor(private prisma: PrismaService) {}

  // Fetch the existing settings
  async getAdminSettings() {
    return this.prisma.adminSettings.findFirst(); // Assuming only one settings entry exists
  }

  // Fetch admin settings by ID
  async getAdminSettingsById(id: number) {
    const settings = await this.prisma.adminSettings.findUnique({
      where: { id },
    });
    if (!settings) {
      throw new NotFoundException(`Admin settings with ID ${id} not found`);
    }
    return settings;
  }

  // Create new admin settings
  async createAdminSettings(data: UpdateAdminSettingsDto) {
    // Check if any settings already exist to avoid duplication
    const existingSettings = await this.prisma.adminSettings.findFirst();
    if (existingSettings) {
      throw new BadRequestException('Settings already exist, use PATCH to update them.');
    }
    return this.prisma.adminSettings.create({ data });
  }

  // Update admin settings using PATCH (partial update)
  async updateAdminSettings(id: number, data: UpdateAdminSettingsDto) {
    const settings = await this.prisma.adminSettings.findUnique({
      where: { id },
    });
    if (!settings) {
      throw new NotFoundException('No settings found to update.');
    }
    return this.prisma.adminSettings.update({
      where: { id },
      data,
    });
  }
}
