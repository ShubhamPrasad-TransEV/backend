import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OperationalSettingsDto } from './dto/operational-settings.dto';

@Injectable()
export class OperationalSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Fetch operational settings by adminId
  async getOperationalSettingsByAdminId(adminId: number) {
    const settings = await this.prisma.operationalSettings.findUnique({
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

  // Create new operational settings
  async createOperationalSettings(data: OperationalSettingsDto) {
    // Check if operational settings already exist
    const existingSettings = await this.getOperationalSettingsByAdminId(
      data.adminId,
    );

    if (existingSettings) {
      throw new BadRequestException(
        'Operational settings for this admin already exist.',
      );
    }

    // Proceed with settings creation if no settings exist
    return this.prisma.operationalSettings.create({
      data,
    });
  }

  // Update operational settings using PATCH by adminId
  async updateOperationalSettings(
    adminId: number,
    data: OperationalSettingsDto,
  ) {
    const settings = await this.getOperationalSettingsByAdminId(adminId);
    if (!settings) {
      throw new NotFoundException('No settings found to update.');
    }

    // Perform the update
    return this.prisma.operationalSettings.update({
      where: { adminId },
      data,
    });
  }
}
