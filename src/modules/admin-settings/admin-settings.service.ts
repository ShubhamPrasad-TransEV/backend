import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAdminSettingsDto } from './dto/admin-settings.dto';

@Injectable()
export class AdminSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Fetch admin settings by adminId
  async getAdminSettingsByAdminId(adminId: number) {
    const settings = await this.prisma.adminSettings.findUnique({
      where: { adminId },
    });
    return settings;
  }

  // Validate if an admin exists by adminId
  async getAdminByAdminId(adminId: number) {
    const admin = await this.prisma.admins.findUnique({
      where: { adminId },
    });
    return admin;
  }

  // Create new admin settings
  async createAdminSettings(data: UpdateAdminSettingsDto) {
    // Create a new entry in the AdminSettings table
    return this.prisma.adminSettings.create({
      data,
    });
  }

  // Update admin settings using PATCH by adminId
  async updateAdminSettings(adminId: number, data: UpdateAdminSettingsDto) {
    const settings = await this.getAdminSettingsByAdminId(adminId);
    if (!settings) {
      throw new NotFoundException('No settings found to update.');
    }

    // Perform the update
    return this.prisma.adminSettings.update({
      where: { adminId },
      data,
    });
  }
}
