import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OperationalSettingsDto } from './dto/operational-settings.dto';

@Injectable()
export class OperationalSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Get operational settings by ID
  async findSettingsById(id: number): Promise<OperationalSettingsDto> {
    return this.prisma.operationalSettings.findUnique({
      where: {
        id: Number(id), // Ensure the id is a number
      },
    });
  }

  // Create operational settings
  async createSettings(operationalSettingsDto: OperationalSettingsDto): Promise<OperationalSettingsDto> {
    return this.prisma.operationalSettings.create({
      data: operationalSettingsDto,
    });
  }

  // Update operational settings
  async updateSettings(id: number, operationalSettingsDto: OperationalSettingsDto): Promise<OperationalSettingsDto> {
    return this.prisma.operationalSettings.update({
      where: { id },
      data: operationalSettingsDto,
    });
  }
}
