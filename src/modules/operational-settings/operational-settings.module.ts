import { Module } from '@nestjs/common';
import { OperationalSettingsAdminController } from '../operational-settings/operational-settings-admin.controller';
import { OperationalSettingsService } from './operational-settings.service';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the import according to your project structure

@Module({
  controllers: [OperationalSettingsAdminController],
  providers: [OperationalSettingsService, PrismaService],
})
export class OperationalSettingsModule {}
